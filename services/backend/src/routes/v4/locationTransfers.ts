import { Router } from 'express';
import moment from 'moment';
import Sequelize, { Op } from 'sequelize';
import { z } from 'zod';
import config from 'config';
import {
  isUserOfType,
  requireHealthDepartmentEmployee,
  requireOperatorOROperatorDevice,
} from 'middlewares/requireUser';
import {
  validateParametersSchema,
  validateSchema,
} from 'middlewares/validateSchema';
import { limitRequestsByUserPerHour } from 'middlewares/rateLimit';
import {
  database,
  Location,
  LocationTransfer,
  LocationTransferTrace,
  LocationGroup,
  Operator,
  UserTransfer,
  Trace,
  TracingProcess,
} from 'database';
import { extractAndVerifyLocationTransfer } from 'utils/signedKeys';
import { AuditLogEvents, AuditStatusType } from 'constants/auditLog';
import { logEvent } from 'utils/hdAuditLog';
import { ApiError, ApiErrorType } from 'utils/apiError';
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
  requireOperatorOROperatorDevice,
  validateParametersSchema(transferIdParametersSchema),
  async request => {
    const transfer = await LocationTransfer.findByPk(request.params.transferId);

    if (!transfer || !request.user) {
      throw new ApiError(ApiErrorType.LOCATION_TRANSFER_NOT_FOUND);
    }

    const location = await Location.findByPk(transfer.locationId, {
      include: {
        model: LocationGroup,
        attributes: ['uuid', 'name'],
        paranoid: false,
      },
      paranoid: false,
    });

    if (location!.operator !== request.user.uuid) {
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
    const {
      HealthDepartment,
      departmentId,
    } = request.user as IHealthDepartmentEmployee;
    const { userTransferId, locations } = request.body;

    const isUserTransfer = !!userTransferId;
    let isStatic = false;

    const maxLocations: number = config.get(
      'luca.locationTransfers.maxLocations'
    );

    if (locations.length > maxLocations) {
      logEvent(request.user, {
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
        const tracingProcess = await TracingProcess.create(
          {
            departmentId,
            userTransferId,
          },
          { transaction }
        );

        if (isUserTransfer) {
          const userTransfer = await UserTransfer.findByPk(userTransferId, {
            transaction,
          });

          if (!userTransfer) {
            logEvent(request.user, {
              type: AuditLogEvents.CREATE_TRACING_PROCESS,
              status: AuditStatusType.ERROR_INVALID_USER,
              meta: {
                viaTan: isUserTransfer,
              },
            });

            throw new ApiError(ApiErrorType.USER_TRANSFER_NOT_FOUND);
          }

          isStatic = !!userTransfer.tan && !userTransfer.tan.endsWith('1');

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
          throw new ApiError(
            ApiErrorType.INVALID_SIGNATURE,
            (error as Error).message
          );
        }

        await Promise.all(
          locationData.map(async data => {
            const location = await Location.findByPk(data.locationId, {
              include: {
                required: true,
                model: Operator,
                paranoid: false,
              },
              paranoid: false,
            });

            if (!location) {
              request.log.error({
                message: 'Missing location for location transfer',
                locations,
              });
              logEvent(request.user, {
                type: AuditLogEvents.CREATE_TRACING_PROCESS,
                status: AuditStatusType.ERROR_TARGET_NOT_FOUND,
                meta: {
                  locationId: data?.locationId,
                  viaTan: isUserTransfer,
                  isStatic,
                },
              });
              return null;
            }

            const locationTransfer = await LocationTransfer.create(
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

            const traces = await Trace.findAll({
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

            await LocationTransferTrace.bulkCreate(
              traces.map(trace => ({
                locationTransferId: locationTransfer.uuid,
                traceId: trace.traceId,
                time: trace.time,
                deviceType: trace.deviceType,
              })),
              { transaction }
            );

            logEvent(request.user, {
              type: AuditLogEvents.CREATE_TRACING_PROCESS,
              status: AuditStatusType.SUCCESS,
              meta: {
                transferId: locationTransfer.uuid,
                viaTan: isUserTransfer,
                isStatic,
              },
            });

            return locationTransfer.uuid;
          })
        );
        return tracingProcess.uuid;
      })
      .catch((error: Error) => {
        logEvent(request.user, {
          type: AuditLogEvents.CREATE_TRACING_PROCESS,
          status: AuditStatusType.ERROR_UNKNOWN_SERVER_ERROR,
          meta: {
            viaTan: isUserTransfer,
            isStatic,
          },
        });

        if (error instanceof ApiError) throw error;

        throw new ApiError(ApiErrorType.UNKNOWN_API_ERROR);
      });

    return response.send({ tracingProcessId });
  }
);

export default router;
