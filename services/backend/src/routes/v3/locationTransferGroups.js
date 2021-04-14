const router = require('express').Router();
const status = require('http-status');
const database = require('../../database');
const {
  validateParametersSchema,
} = require('../../middlewares/validateSchema');

const { groupIdParametersSchema } = require('./locationTransferGroups.schemas');

router.get(
  '/:groupId',
  validateParametersSchema(groupIdParametersSchema),
  async (request, response) => {
    const locationTransferGroup = await database.LocationTransferGroup.findByPk(
      request.params.groupId,
      {
        include: {
          model: database.LocationTransfer,
          where: {
            isCompleted: false,
          },
        },
      }
    );

    if (!locationTransferGroup) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      transfers: locationTransferGroup.LocationTransfers.map(
        transfer => transfer.uuid
      ),
    });
  }
);

module.exports = router;
