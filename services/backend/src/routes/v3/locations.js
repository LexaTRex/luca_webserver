const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const { Op, fn, col } = require('sequelize');

const database = require('../../database');
const {
  validateSchema,
  validateParametersSchema,
  validateQuerySchema,
} = require('../../middlewares/validateSchema');
const {
  limitRequestsPerDay,
  limitRequestsPerHour,
} = require('../../middlewares/rateLimit');
const { formatLocationName } = require('../../utils/format');
const additionalDataSchemaRouter = require('./locations/additionalDataSchema');
const {
  privateEventCreateSchema,
  locationTracesQuerySchema,
  locationIdParametersSchema,
  accessIdParametersSchema,
} = require('./locations.schemas');

// create private event
router.post(
  '/private',
  validateSchema(privateEventCreateSchema),
  limitRequestsPerDay(100),
  async (request, response) => {
    const location = await database.Location.create({
      radius: 0,
      isPrivate: true,
      publicKey: request.body.publicKey,
    });

    response.status(status.CREATED);
    response.send({
      locationId: location.uuid,
      scannerId: location.scannerId,
      accessId: location.accessId,
    });
  }
);

// delete location
router.delete(
  '/:accessId',
  validateParametersSchema(accessIdParametersSchema),
  limitRequestsPerDay(1000),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        accessId: request.params.accessId,
      },
    });
    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    // update timeframes of ongoing traces, end time is now
    await database.Trace.update(
      {
        time: fn('tstzrange', fn('lower', col('time')), moment().toISOString()),
      },
      {
        where: {
          locationId: location.uuid,
          time: {
            [Op.contains]: moment(),
          },
        },
      }
    );

    await location.destroy();
    return response.sendStatus(status.NO_CONTENT);
  }
);

// get a single location
router.get(
  '/:locationId',
  validateParametersSchema(locationIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        uuid: request.params.locationId,
      },
      include: {
        model: database.LocationGroup,
      },
      paranoid: false,
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const locationDTO = {
      isIndoor: location.isIndoor,
      type: location.type,
      locationId: location.uuid,
      publicKey: location.publicKey,
      name: formatLocationName(location, location.LocationGroup),
      groupName: location.LocationGroup?.name,
      locationName: location.name,
      lat: location.lat || 0,
      lng: location.lng || 0,
      radius: location.shouldProvideGeoLocation ? location.radius : 0,
      createdAt: moment(location.createdAt).unix(),
      isPrivate: location.isPrivate,
    };

    return response.send(locationDTO);
  }
);

// get guest list
router.get(
  '/traces/:accessId',
  validateQuerySchema(locationTracesQuerySchema),
  validateParametersSchema(accessIdParametersSchema),
  limitRequestsPerHour(1000, { skipSuccessfulRequests: true }),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        accessId: request.params.accessId,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const traceQuery = {
      locationId: location.uuid,
    };

    switch (request.query.duration) {
      case 'today':
        traceQuery.time = {
          [Op.strictRight]: [null, moment().startOf('day')],
        };
        break;
      case 'week':
        traceQuery.time = {
          [Op.strictRight]: [null, moment().subtract(7, 'days')],
        };
        break;
      default:
    }

    const traces = await database.Trace.findAll({
      where: traceQuery,
      include: {
        model: database.TraceData,
      },
      order: [['updatedAt', 'DESC']],
    });

    return response.send(
      traces.map(trace => ({
        traceId: trace.traceId,
        deviceType: trace.deviceType,
        checkin: moment(trace.time[0].value).unix(),
        checkout: moment(trace.time[1].value).unix(),
        data: trace.TraceDatum
          ? {
              data: trace.TraceDatum.data,
              iv: trace.TraceDatum.iv,
              mac: trace.TraceDatum.mac,
              publicKey: trace.TraceDatum.publicKey,
            }
          : null,
      }))
    );
  }
);

router.use('/additionalDataSchema', additionalDataSchemaRouter);

module.exports = router;
