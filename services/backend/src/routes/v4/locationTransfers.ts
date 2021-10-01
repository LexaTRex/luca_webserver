import { Router } from 'express';
import moment from 'moment';
import Sequelize, { Op } from 'sequelize';
import { z } from 'zod';
import config from 'config';
import logger from 'utils/logger';
import {
  isUserOfType,
  requireHealthDepartmentEmployee,
} from 'middlewares/requireUser';
import {
  validateParametersSchema,
  validateSchema,
} from 'middlewares/validateSchema';
import { limitRequestsByUserPerHour } from 'middlewares/rateLimit';
import database from 'database/models';
import { extractAndVerifyLocationTransfer } from 'utils/signedKeys';
import { ApiError, ApiErrorType } from 'utils/apiError';
import { AuditLogEvents, AuditStatusType } from 'constants/auditLog';
import { logEvent } from 'utils/hdAuditLog';
import {
  createSchema,
  transferIdParametersSchema,
} from './locationTransfers.schemas';

const router = Router();

/**
 * Get a single location transfer by ID, containing issuing health department,
 * involved locations and associated traces
 */
router.get(
  '/:transferId',
  validateParametersSchema(transferIdParametersSchema),
  async request => {
    const transfer = await database.LocationTransfer.findByPk(
      request.params.transferId
    );

    if (!transfer || !request.user) {
      throw new ApiError(ApiErrorType.LOCATION_TRANSFER_NOT_FOUND);
    }

    if (
      isUserOfType('HealthDepartmentEmployee', request) &&
      transfer.departmentId !==
        (request.user as IHealthDepartmentEmployee).departmentId
    ) {
      throw new ApiError(ApiErrorType.FORBIDDEN);
    }

    const location = await database.Location.findByPk(transfer.locationId, {
      include: {
        model: database.LocationGroup,
        attributes: ['uuid', 'name'],
        paranoid: false,
      },
      paranoid: false,
    });

    if (
      isUserOfType('Operator', request) &&
      location.operator !== request.user.uuid
    ) {
      throw new ApiError(ApiErrorType.FORBIDDEN);
    }

    return {
      transfer: transfer.signedLocationTransfer,
    };
  }
);

/**
 * Create a transfer request for venues traced by an infected guest. Preceded
 * by a user transfer of check-in history, this will check for venues an
 * infected guest has checked-in to in order to determine potential contact persons
 * @see https://www.luca-app.de/securityoverview/processes/tracing_find_contacts.html#process
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html
 */
router.post<unknown, unknown, z.infer<typeof createSchema>>(
  '/',
  requireHealthDepartmentEmployee,
  limitRequestsByUserPerHour('location_transfer_post_ratelimit_hour'),
  validateSchema(createSchema),
  async (request, response) => {
    const { user, body } = request;
    const {
      HealthDepartment,
      departmentId,
    } = user as IHealthDepartmentEmployee;
    const { userTransferId, locations } = body;

    const isUserTransfer = !!userTransferId;

    const maxLocations: number = config.get(
      'luca.locationTransfers.maxLocations'
    );

    if (locations.length > maxLocations) {
      logEvent(user, {
        type: AuditLogEvents.CREATE_TRACING_PROCESS,
        status: AuditStatusType.ERROR_LIMIT_EXCEEDED,
        meta: {
          viaTan: isUserTransfer,
        },
      });

      throw new ApiError(ApiErrorType.TOO_MANY_LOCATIONS);
    }

    const tracingProcessId = await database
      .transaction(async (transaction: Sequelize.Transaction) => {
        const tracingProcess = await database.TracingProcess.create(
          {
            departmentId,
            userTransferId,
          },
          { transaction }
        );

        if (isUserTransfer) {
          const userTransfer = await database.UserTransfer.findByPk(
            userTransferId,
            { transaction }
          );

          if (!userTransfer) {
            logEvent(user, {
              type: AuditLogEvents.CREATE_TRACING_PROCESS,
              status: AuditStatusType.ERROR_INVALID_USER,
              meta: {
                viaTan: isUserTransfer,
              },
            });

            throw new ApiError(ApiErrorType.USER_TRANSFER_NOT_FOUND);
          }

          await userTransfer.update(
            {
              departmentId,
              tan: null,
            },
            { transaction }
          );
        }

        let locationData;

        try {
          locationData = locations.map(
            ({ signedLocationTransfer, locationId, time }) => ({
              ...extractAndVerifyLocationTransfer({
                signedLocationTransfer,
                locationId,
                time,
                healthDepartment: HealthDepartment,
              }),
              signedLocationTransfer,
            })
          );
        } catch (error) {
          // @ts-ignore error is unknown typed
          throw new ApiError(ApiErrorType.INVALID_SIGNATURE, error.message);
        }

        await Promise.all(
          locationData.map(async data => {
            const location = await database.Location.findByPk(data.locationId, {
              include: {
                required: true,
                model: database.Operator,
                paranoid: false,
              },
              paranoid: false,
            });

            if (!location) {
              logger.error({
                message: 'Missing location for location transfer',
                locations,
              });
              logEvent(user, {
                type: AuditLogEvents.CREATE_TRACING_PROCESS,
                status: AuditStatusType.ERROR_TARGET_NOT_FOUND,
                meta: {
                  locationId: data?.locationId || location?.uuid,
                  viaTan: isUserTransfer,
                },
              });
              return null;
            }

            const locationTransfer = await database.LocationTransfer.create(
              {
                departmentId,
                tracingProcessId: tracingProcess.uuid,
                locationId: location.uuid,
                time: [
                  moment.unix(data.time[0]).toDate(),
                  moment.unix(data.time[1]).toDate(),
                ],
                signedLocationTransfer: data.signedLocationTransfer,
              },
              { transaction }
            );

            const traces = await database.Trace.findAll({
              where: {
                locationId: location.uuid,
                time: {
                  [Op.overlap]: [
                    moment.unix(data.time[0]).toDate(),
                    moment.unix(data.time[1]).toDate(),
                  ],
                },
              },
            });

            await database.LocationTransferTrace.bulkCreate(
              // @ts-ignore - any until models are typed
              traces.map(trace => ({
                locationTransferId: locationTransfer.uuid,
                traceId: trace.traceId,
                time: trace.time,
                deviceType: trace.deviceType,
              })),
              { transaction }
            );

            logEvent(user, {
              type: AuditLogEvents.CREATE_TRACING_PROCESS,
              status: AuditStatusType.SUCCESS,
              meta: {
                transferId: locationTransfer.uuid,
                viaTan: isUserTransfer,
              },
            });

            return locationTransfer.uuid;
          })
        );
        return tracingProcess.uuid;
      })
      .catch((error: Error) => {
        logEvent(user, {
          type: AuditLogEvents.CREATE_TRACING_PROCESS,
          status: AuditStatusType.ERROR_UNKNOWN_SERVER_ERROR,
          meta: {
            viaTan: isUserTransfer,
          },
        });

        if (error instanceof ApiError) throw error;
        throw new ApiError(ApiErrorType.UNKNOWN_API_ERROR);
      });

    return response.send({ tracingProcessId });
  }
);

export default router;
