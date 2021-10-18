/**
 * @overview Provides CRUD endpoints for additional data schemes of a given location
 * @see https://www.luca-app.de/securityoverview/processes/additional_data.html
 */
const config = require('config');
const router = require('express').Router();
const status = require('http-status');

const database = require('../../../database');
const {
  validateParametersSchema,
  validateSchema,
} = require('../../../middlewares/validateSchema');

const {
  requireOperator,
  requireNonDeletedUser,
} = require('../../../middlewares/requireUser');

const {
  locationIdParametersSchema,
  additionalDataParameters,
  additionalDataBody,
} = require('./additionalDataSchema.schemas');

/**
 * Get additional data scheme of a location
 * @param locationId of the given venue
 * @see https://www.luca-app.de/securityoverview/processes/additional_data.html
 */
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

/**
 * Set additional data scheme of a location, allowing the tracing to be narrowed down
 * @param locationId of the given venue
 * @returns ID of the additional data scheme
 * @see https://www.luca-app.de/securityoverview/processes/additional_data.html
 */
router.post(
  '/:locationId',
  requireOperator,
  requireNonDeletedUser,
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
    const existingCount = await database.AdditionalDataSchema.count({
      where: {
        locationId: request.params.locationId,
      },
    });
    if (existingCount > config.get('luca.locations.maxAdditionalData')) {
      return response.sendStatus(status.FORBIDDEN);
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

/**
 * Update additional data scheme
 * @param additionalDataId of the scheme to be updated
 * @see https://www.luca-app.de/securityoverview/processes/additional_data.html
 */
router.patch(
  '/:additionalDataId',
  requireOperator,
  requireNonDeletedUser,
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

/**
 * Remove an additional data scheme
 * @param additionalDataId of the scheme to be deleted
 * @see https://www.luca-app.de/securityoverview/processes/additional_data.html
 */
router.delete(
  '/:additionalDataId',
  requireOperator,
  requireNonDeletedUser,
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
