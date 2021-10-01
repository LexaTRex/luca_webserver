import { Router, Request, Response } from 'express';
import { z } from 'zod';
import status from 'http-status';
import moment from 'moment';
import { UniqueConstraintError, Op } from 'sequelize';
import database from 'database';
import { validateSchema } from 'middlewares/validateSchema';
import { limitRequestsPerHour } from 'middlewares/rateLimit';
import { OperatorDevice } from 'constants/operatorDevice';
import {
  requireOperatorDeviceRoles,
  requireOperatorOROperatorDevice,
} from 'middlewares/requireUser';

import { checkinSchema, checkoutSchema } from './traces.schemas';

const router = Router();

/**
 * Performs a check-in in a location with a badge or via form with authenticated operator
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#qr-code-scanning-validation-and-check-in-upload
 */
router.post<unknown, unknown, z.infer<typeof checkinSchema>>(
  '/checkin',
  limitRequestsPerHour('traces_checkin_post_ratelimit_hour'),
  requireOperatorOROperatorDevice,
  validateSchema(checkinSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerId: request.body.scannerId,
        operator: request.user!.uuid,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const trace = await database.Trace.findByPk(request.body.traceId);

    if (trace) {
      return response.sendStatus(status.CREATED);
    }

    const requestTime = moment.unix(request.body.timestamp);

    const now = moment();

    if (Math.abs(moment.duration(now.diff(requestTime)).as('seconds')) > 300) {
      return response.sendStatus(status.CONFLICT);
    }

    try {
      await database.Trace.create({
        traceId: request.body.traceId,
        locationId: location.uuid,
        time: [requestTime, location.endsAt],
        data: request.body.data,
        iv: request.body.iv,
        mac: request.body.mac,
        publicKey: request.body.publicKey,
        deviceType: request.body.deviceType,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return response.sendStatus(status.CREATED);
      }
      throw error;
    }

    return response.sendStatus(status.CREATED);
  }
);

router.post<unknown, unknown, z.infer<typeof checkoutSchema>>(
  '/checkout',
  requireOperatorOROperatorDevice,
  requireOperatorDeviceRoles([OperatorDevice.employee, OperatorDevice.manager]),
  validateSchema(checkoutSchema),
  async (request, response) => {
    const trace = await database.Trace.findOne({
      where: {
        traceId: request.body.traceId,
        time: {
          [Op.contains]: moment(),
        },
      },
      include: {
        model: database.Location,
        where: {
          operator: request.user!.uuid,
        },
      },
    });

    if (!trace) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const checkinTime = moment(trace.time[0].value);
    const checkoutTime = moment.unix(request.body.timestamp);

    if (checkoutTime <= checkinTime) {
      return response.sendStatus(status.CONFLICT);
    }

    await trace.update({
      time: [checkinTime, checkoutTime],
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

export default router;
