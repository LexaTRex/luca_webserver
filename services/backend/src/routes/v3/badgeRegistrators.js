const router = require('express').Router();
const status = require('http-status');

const database = require('../../database');
const {
  validateParametersSchema,
} = require('../../middlewares/validateSchema');

const { parametersSchema } = require('./badgeRegistrators.schemas');

// get badge registrator
router.get(
  '/:registratorId',
  validateParametersSchema(parametersSchema),
  async (request, response) => {
    const badgeRegistrator = await database.BadgeRegistrator.findOne({
      where: {
        uuid: request.params.registratorId,
      },
    });

    if (!badgeRegistrator) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send(badgeRegistrator);
  }
);

module.exports = router;
