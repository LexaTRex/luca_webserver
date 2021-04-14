/* eslint max-lines: off */
const config = require('config');
const router = require('express').Router();
const status = require('http-status');
const { Op } = require('sequelize');
const moment = require('moment');
const { hexToBase64, base64ToHex } = require('@lucaapp/crypto');

const database = require('../../database');
const { calculateTraceIds } = require('../../utils/crypto');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const {
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');
const { limitRequestsPerHour } = require('../../middlewares/rateLimit');

const {
  checkoutSchema,
  checkinSchema,
  additionalDataSchema,
  bulkSchema,
  traceIdParametersSchema,
  traceSchema,
} = require('./traces.schemas');

const STATIC_DEVICE_TYPE = 2;

// checkin
router.post(
  '/checkin',
  validateSchema(checkinSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: { scannerId: request.body.scannerId },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
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

    return response.sendStatus(status.CREATED);
  }
);

// add additionalData to checkin
router.post(
  '/additionalData',
  limitRequestsPerHour(60, { skipSuccessfulRequests: true }),
  validateSchema(additionalDataSchema),
  async (request, response) => {
    const existingData = await database.TraceData.findByPk(
      request.body.traceId
    );

    if (existingData) {
      return response.sendStatus(status.CONFLICT);
    }

    const existingTrace = await database.Trace.findByPk(request.body.traceId);

    if (!existingTrace) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await database.TraceData.create({
      traceId: request.body.traceId,
      data: request.body.data,
      iv: request.body.iv,
      mac: request.body.mac,
      publicKey: request.body.publicKey,
    });

    return response.sendStatus(status.CREATED);
  }
);

// check traces in bulk
router.post('/bulk', validateSchema(bulkSchema), async (request, response) => {
  const traces = await database.Trace.findAll({
    where: {
      traceId: request.body.traceIds,
      deviceType: {
        [Op.not]: STATIC_DEVICE_TYPE,
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

// get trace
router.get(
  '/:traceId',
  validateParametersSchema(traceIdParametersSchema),
  async (request, response) => {
    const trace = await database.Trace.findOne({
      where: {
        traceId: hexToBase64(request.params.traceId),
        deviceType: {
          [Op.not]: STATIC_DEVICE_TYPE,
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

// checkout
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

// trace via tracingSecret
router.post(
  '/trace',
  requireHealthDepartmentEmployee,
  validateSchema(traceSchema),
  async (request, response) => {
    const userId = request.body.userId.replace(/-/g, '');
    let traceIds = [];

    if (request.body.userTracingSecret) {
      const start = moment().seconds(0).subtract(14, 'days').unix();
      const userTracingSecret = base64ToHex(request.body.userTracingSecret);
      traceIds = calculateTraceIds(userId, userTracingSecret, start, 14);
    } else if (request.body.userTracingSecrets) {
      traceIds = request.body.userTracingSecrets.flatMap(({ ts, s }) =>
        calculateTraceIds(userId, base64ToHex(s), ts, 1)
      );
    }

    const traces = await database.Trace.findAll({
      where: {
        traceId: traceIds,
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
