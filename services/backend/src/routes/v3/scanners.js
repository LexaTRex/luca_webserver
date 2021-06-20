const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');

const database = require('../../database');
const {
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const { formatLocationName } = require('../../utils/format');

const {
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
      groupName: location.LocationGroup?.name,
      locationName: location.name,
      name: formatLocationName(location, location.LocationGroup),
      scannerId: location.scannerId,
      locationId: location.uuid,
      publicKey: location.publicKey,
      endsAt: moment(location.endsAt).unix(),
      tableCount: location.tableCount,
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

module.exports = router;
