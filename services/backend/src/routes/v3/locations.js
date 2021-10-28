const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');

const {
  database,
  Location,
  LocationGroup,
  Trace,
  TraceData,
} = require('../../database');
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
  limitRequestsPerDay('locations_private_post_ratelimit_day'),
  validateSchema(privateEventCreateSchema),
  async (request, response) => {
    const location = await Location.create({
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

/**
 * Delete a single location
 */
router.delete(
  '/:accessId',
  validateParametersSchema(accessIdParametersSchema),
  limitRequestsPerDay('locations_delete_ratelimit_day'),
  async (request, response) => {
    const location = await Location.findOne({
      where: {
        accessId: request.params.accessId,
      },
    });
    if (!location || !location.isPrivate) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await database.transaction(async transaction => {
      await location.checkoutAllTraces(transaction);
      await location.destroy({ transaction });
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

/**
 * Get a single location
 * @see https://luca-app.de/securityoverview/processes/venue_registration.html
 */
router.get(
  '/:locationId',
  validateParametersSchema(locationIdParametersSchema),
  async (request, response) => {
    const location = await Location.findOne({
      where: {
        uuid: request.params.locationId,
      },
      include: {
        model: LocationGroup,
      },
      paranoid: false,
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const locationDTO = {
      locationId: location.uuid,
      publicKey: location.publicKey,
      name: formatLocationName(location, location.LocationGroup),
      groupName: location.LocationGroup?.name,
      locationName: location.name,
      lat: location.lat || 0,
      lng: location.lng || 0,
      radius: location.shouldProvideGeoLocation ? location.radius : 0,
      isPrivate: location.isPrivate,
      averageCheckinTime: location.averageCheckinTime,
    };

    return response.send(locationDTO);
  }
);

/**
 * Get the guest list of a location, effectively fetching trace IDs and their
 * associated encrypted data, decrypting contact data by a health department
 * still requires the user to consent/share required data
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html
 */
router.get(
  '/traces/:accessId',
  limitRequestsPerHour('locations_traces_get_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  validateQuerySchema(locationTracesQuerySchema),
  validateParametersSchema(accessIdParametersSchema),
  async (request, response) => {
    const location = await Location.findOne({
      where: {
        accessId: request.params.accessId,
      },
    });

    if (!location || !location.isPrivate) {
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

    const traces = await Trace.findAll({
      where: traceQuery,
      order: [['updatedAt', 'DESC']],
      include: {
        model: TraceData,
      },
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
