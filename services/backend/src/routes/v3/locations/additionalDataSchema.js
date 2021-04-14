const router = require('express').Router();
const status = require('http-status');

const database = require('../../../database');
const {
  validateParametersSchema,
  validateSchema,
} = require('../../../middlewares/validateSchema');

const { requireOperator } = require('../../../middlewares/requireUser');

const {
  locationIdParametersSchema,
  additionalDataParameters,
  additionalDataBody,
} = require('./additionalDataSchema.schemas');

// get additional data schema
router.get(
  '/:locationId',
  validateParametersSchema(locationIdParametersSchema),
  async (request, response) => {
    const schemas = await database.AdditionalDataSchema.findAll({
      where: {
        locationId: request.params.locationId,
      },
    });

    return response.send({
      additionalData: schemas.map(schema => ({
        uuid: schema.uuid,
        key: schema.key,
        label: schema.label,
        isRequired: schema.isRequired,
      })),
    });
  }
);

// set additional data schema
router.post(
  '/:locationId',
  requireOperator,
  validateParametersSchema(locationIdParametersSchema),
  validateSchema(additionalDataBody),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        uuid: request.params.locationId,
        operator: request.user.uuid,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const schema = await database.AdditionalDataSchema.create({
      locationId: location.uuid,
      key: request.body.key,
      label: request.body.label,
      isRequired: request.body.isRequired,
    });

    return response.send({
      uuid: schema.uuid,
      key: schema.key,
      label: schema.label,
      isRequired: schema.isRequired,
    });
  }
);

// update additional data schema
router.patch(
  '/:additionalDataId',
  requireOperator,
  validateParametersSchema(additionalDataParameters),
  validateSchema(additionalDataBody),
  async (request, response) => {
    const additionalData = await database.AdditionalDataSchema.findOne({
      where: {
        uuid: request.params.additionalDataId,
      },
      include: {
        required: true,
        model: database.Location,
        where: {
          operator: request.user.uuid,
        },
      },
    });

    if (!additionalData) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await additionalData.update({
      ...request.body,
    });

    return response.sendStatus(status.OK);
  }
);

// remove additional data schema
router.delete(
  '/:additionalDataId',
  requireOperator,
  validateParametersSchema(additionalDataParameters),
  async (request, response) => {
    const additionalData = await database.AdditionalDataSchema.findOne({
      where: {
        uuid: request.params.additionalDataId,
      },
      include: {
        required: true,
        model: database.Location,
        where: {
          operator: request.user.uuid,
        },
      },
    });

    if (!additionalData) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await additionalData.destroy();

    return response.sendStatus(status.OK);
  }
);

module.exports = router;
