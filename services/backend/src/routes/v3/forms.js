const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const { UniqueConstraintError } = require('sequelize');

const database = require('../../database');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const { limitRequestsPerHour } = require('../../middlewares/rateLimit');
const { formatLocationName } = require('../../utils/format');
const { DEVICE_TYPE_FORM } = require('../../constants/deviceTypes');
const { checkinSchema, formIdParametersSchema } = require('./forms.schemas');

// get single form infos
router.get(
  '/:formId',
  validateParametersSchema(formIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        formId: request.params.formId,
      },
      include: [
        {
          model: database.LocationGroup,
        },
        {
          model: database.Operator,
          paranoid: false,
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
      locationId: location.uuid,
      publicKey: location.publicKey,
      endsAt: moment(location.endsAt).unix(),
      tableCount: location.tableCount,
    });
  }
);

/**
 * Performs a check-in in a location via form
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#qr-code-scanning-validation-and-check-in-upload
 */
router.post(
  '/:formId/traces/checkin',
  limitRequestsPerHour('traces_checkin_post_ratelimit_hour'),
  validateParametersSchema(formIdParametersSchema),
  validateSchema(checkinSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        scannerId: request.body.scannerId,
        formId: request.params.formId,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (request.body.deviceType !== DEVICE_TYPE_FORM) {
      return response.sendStatus(status.FORBIDDEN);
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
