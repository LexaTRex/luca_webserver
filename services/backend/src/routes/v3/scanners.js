const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const { Op, UniqueConstraintError } = require('sequelize');

const database = require('../../database');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const { limitRequestsPerHour } = require('../../middlewares/rateLimit');
const { formatLocationName } = require('../../utils/format');

const {
  checkinSchema,
  scannerIdParametersSchema,
  scannerAccessIdParametersSchema,
} = require('./scanners.schemas');

/**
 * Returns data for the scanner given by the scanner id.
 * Used for self check-in.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_self_checkin.html#check-in-via-the-guest-app
 */
router.get(
  '/:scannerId',
  validateParametersSchema(scannerIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerId: request.params.scannerId,
      },
      include: [
        {
          model: database.LocationGroup,
        },
        {
          model: database.Operator,
          paranoid: false,
          attributes: ['deletedAt'],
        },
      ],
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (location.Operator?.deletedAt) {
      return response.sendStatus(status.GONE);
    }

    return response.send({
      scannerId: location.scannerId,
      locationId: location.uuid,
      publicKey: location.publicKey,
    });
  }
);

/**
 * Returns extended data for the scanner given by the scanner access id.
 * Used for conventional app check-in.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#qr-code-scanning-validation-and-check-in-upload
 */
router.get(
  '/access/:scannerAccessId',
  validateParametersSchema(scannerAccessIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerAccessId: request.params.scannerAccessId,
      },
      include: [
        {
          model: database.LocationGroup,
        },
        {
          model: database.Operator,
          paranoid: false,
          attributes: ['deletedAt'],
        },
      ],
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (location.Operator.deletedAt) {
      return response.sendStatus(status.GONE);
    }

    return response.send({
      groupName: location.LocationGroup?.name,
      locationName: location.name,
      name: formatLocationName(location, location.LocationGroup),
      scannerId: location.scannerId,
      scannerAccessId: location.scannerAccessId,
      locationId: location.uuid,
      publicKey: location.publicKey,
      endsAt: moment(location.endsAt).unix(),
      tableCount: location.tableCount,
    });
  }
);

/**
 * Returns the current amount of check-ins for the specified scanner access id.
 */
router.get(
  '/:scannerAccessId/traces/count/current',
  validateParametersSchema(scannerAccessIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerAccessId: request.params.scannerAccessId,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const count = await database.Trace.count({
      where: {
        locationId: location.uuid,
        time: {
          [Op.contains]: moment(),
        },
      },
    });
    response.type('text/plain');
    return response.send(`${count}`);
  }
);

/**
 * Returns the total amount of check-ins for the specified scanner access id.
 */
router.get(
  '/:scannerAccessId/traces/count/total',
  validateParametersSchema(scannerAccessIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerAccessId: request.params.scannerAccessId,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const count = await database.Trace.count({
      where: {
        locationId: location.uuid,
      },
    });

    response.type('text/plain');
    return response.send(`${count}`);
  }
);

/**
 * Performs a check-in in a location via a scanner
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#qr-code-scanning-validation-and-check-in-upload
 */
router.post(
  '/:scannerAccessId/traces/checkin',
  limitRequestsPerHour('traces_checkin_post_ratelimit_hour'),
  validateParametersSchema(scannerAccessIdParametersSchema),
  validateSchema(checkinSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerId: request.body.scannerId,
        scannerAccessId: request.params.scannerAccessId,
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

module.exports = router;
