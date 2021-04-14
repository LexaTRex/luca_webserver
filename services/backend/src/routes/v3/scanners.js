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

// get a scanner
router.get(
  '/:scannerId',
  validateParametersSchema(scannerIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerId: request.params.scannerId,
      },
      include: {
        model: database.LocationGroup,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
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

// get extended scanner infos
router.get(
  '/access/:scannerAccessId',
  validateParametersSchema(scannerAccessIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerAccessId: request.params.scannerAccessId,
      },
      include: {
        model: database.LocationGroup,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
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

// get current checkin count
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

// get total checkin count
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
