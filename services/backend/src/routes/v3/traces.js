/* eslint max-lines: off */
const config = require('config');
const router = require('express').Router();
const status = require('http-status');
const { Op, UniqueConstraintError } = require('sequelize');
const moment = require('moment');
const { hexToBase64 } = require('@lucaapp/crypto');

const database = require('../../database');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const {
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');
const { limitRequestsPerHour } = require('../../middlewares/rateLimit');

const { DEVICE_TYPE_STATIC } = require('../../constants/deviceTypes');

const {
  checkoutSchema,
  checkinSchema,
  additionalDataSchema,
  bulkSchema,
  traceIdParametersSchema,
  traceSchema,
} = require('./traces.schemas');

/**
 * Performs a check-in in a location.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#qr-code-scanning-validation-and-check-in-upload
 */
router.post(
  '/checkin',
  limitRequestsPerHour(1000),
  validateSchema(checkinSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: { scannerId: request.body.scannerId },
      include: {
        model: database.Operator,
        attributes: ['deletedAt'],
        required: false,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (location.Operator && location.Operator.deletedAt) {
      return response.sendStatus(status.GONE);
    }

    const trace = await database.Trace.findByPk(request.body.traceId);
    if (trace) {
      return response.sendStatus(status.CREATED);
    }

    if (location.isPrivate) {
      const checkinCount = await database.Trace.count({
        where: {
          locationId: location.uuid,
          time: {
            [Op.contains]: moment(),
          },
        },
      });

      if (checkinCount >= 50) {
        return response.sendStatus(status.NOT_FOUND);
      }
    }

    const now = moment();
    const requestTime = moment.unix(request.body.timestamp);
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

/**
 * Adds additional data to a check-in identified by the given trace id.
 *
 * @see https://www.luca-app.de/securityoverview/processes/additional_data.html
 */
router.post(
  '/additionalData',
  limitRequestsPerHour(60, { skipSuccessfulRequests: true }),
  validateSchema(additionalDataSchema),
  async (request, response) => {
    const existingData = await database.TraceData.findByPk(
      request.body.traceId
    );

    if (existingData) {
      return response.sendStatus(status.CREATED);
    }

    const existingTrace = await database.Trace.findByPk(request.body.traceId);

    if (!existingTrace) {
      return response.sendStatus(status.NOT_FOUND);
    }

    try {
      await database.TraceData.create({
        traceId: request.body.traceId,
        data: request.body.data,
        iv: request.body.iv,
        mac: request.body.mac,
        publicKey: request.body.publicKey,
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

/**
 * Checks if any of the given trace ids are known to the server. This is used
 * in the app to provide feedback when a check-in has been successful.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#qr-code-scanning-feedback
 */
router.post('/bulk', validateSchema(bulkSchema), async (request, response) => {
  const traces = await database.Trace.findAll({
    where: {
      traceId: request.body.traceIds,
      deviceType: {
        [Op.not]: DEVICE_TYPE_STATIC,
      },
      createdAt: {
        [Op.gt]: moment().subtract(
          config.get('luca.traces.maximumRequestablePeriod'),
          'hours'
        ),
      },
    },
  });

  return response.send(
    traces.map(trace => ({
      traceId: trace.traceId,
      checkin: moment(trace.time[0].value).unix(),
      checkout: moment(trace.time[1].value).unix(),
      locationId: trace.locationId,
      createdAt: moment(trace.createdAt).unix(),
    }))
  );
});

/**
 * Retrieves information about the given trace id. This is used in the app
 * to check if a trace id is still checked in.
 */
router.get(
  '/:traceId',
  validateParametersSchema(traceIdParametersSchema),
  async (request, response) => {
    const trace = await database.Trace.findOne({
      where: {
        traceId: hexToBase64(request.params.traceId),
        deviceType: {
          [Op.not]: DEVICE_TYPE_STATIC,
        },
        createdAt: {
          [Op.gt]: moment().subtract(
            config.get('luca.traces.maximumRequestablePeriod'),
            'hours'
          ),
        },
      },
    });

    if (!trace) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      traceId: trace.traceId,
      checkin: moment(trace.time[0].value).unix(),
      checkout: moment(trace.time[1].value).unix(),
      locationId: trace.locationId,
      createdAt: moment(trace.createdAt).unix(),
    });
  }
);

/**
 * Performs a checkout for the given trace id.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_checkout.html
 */
router.post(
  '/checkout',
  validateSchema(checkoutSchema),
  async (request, response) => {
    const trace = await database.Trace.findOne({
      where: {
        traceId: request.body.traceId,
        time: {
          [Op.contains]: moment(),
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

/**
 * Returns check-in information for all trace ids that can be derived from the
 * given user tracing secret which have been used for check-ins in the
 * epidemiologically relevant timespan. This is used by the health departments
 * to find potential contact persons.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html#reconstructing-the-infected-guest-s-check-in-history
 */
router.post(
  '/trace',
  requireHealthDepartmentEmployee,
  validateSchema(traceSchema, '600kb'),
  async (request, response) => {
    const traces = await database.Trace.findAll({
      where: {
        traceId: request.body.traceIds,
      },
      include: {
        model: database.Location,
        where: {
          operator: { [Op.not]: null },
        },
      },
    });

    const result = traces.map(trace => ({
      locationId: trace.locationId,
      time: [
        moment(trace.time[0].value).unix(),
        trace.time[1].value
          ? moment(trace.time[1].value).unix()
          : moment(trace.time[0].value).add(1, 'day').unix(),
      ],
    }));
    return response.send(result);
  }
);

module.exports = router;
