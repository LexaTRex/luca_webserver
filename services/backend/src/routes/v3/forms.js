const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');

const database = require('../../database');
const {
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const { formatLocationName } = require('../../utils/format');

const { formIdParametersSchema } = require('./forms.schemas');

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

module.exports = router;
