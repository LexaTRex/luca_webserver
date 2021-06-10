/* eslint-disable sonarjs/no-duplicate-string */
const router = require('express').Router();
const status = require('http-status');

const {
  createSchema,
  updateSchema,
  locationIdParametersSchema,
} = require('./locations.schemas');

const database = require('../../../database');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');
const {
  requireOperator,
  requireNonDeletedUser,
} = require('../../../middlewares/requireUser');

// get own locations
router.get('/', requireOperator, async (request, response) => {
  const locations = await database.Location.findAll({
    where: {
      operator: request.user.uuid,
    },
  });
  response.send(locations);
});

router.get(
  '/:locationId',
  validateParametersSchema(locationIdParametersSchema),
  requireOperator,
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        uuid: request.params.locationId,
        operator: request.user.uuid,
      },
      include: [
        {
          model: database.LocationGroup,
          attributes: ['name'],
        },
      ],
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send(location);
  }
);

// create location
router.post(
  '/',
  requireOperator,
  requireNonDeletedUser,
  validateSchema(createSchema),
  async (request, response) => {
    const group = await database.LocationGroup.findOne({
      where: { uuid: request.body.groupId, operatorId: request.user.uuid },
    });
    if (!group) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const baseLocation = await database.Location.findOne({
      where: { groupId: request.body.groupId },
    });

    let location;

    await database.transaction(async transaction => {
      location = await database.Location.create(
        {
          operator: request.user.uuid,
          publicKey: baseLocation.publicKey,
          groupId: request.body.groupId,
          name: request.body.locationName,
          firstName: request.body.firstName || request.user.firstName,
          lastName: request.body.lastName || request.user.lastName,
          phone: request.body.phone,
          streetName: request.body.streetName,
          streetNr: request.body.streetNr,
          zipCode: request.body.zipCode,
          city: request.body.city,
          state: request.body.state,
          lat: request.body.lat,
          lng: request.body.lng,
          radius: request.body.radius || 0,
          shouldProvideGeoLocation: request.body.radius > 0,
          tableCount: request.body.tableCount,
          isIndoor: request.body.isIndoor,
          type: request.body.type,
        },
        { transaction }
      );

      if (request.body.additionalData) {
        await Promise.all(
          request.body.additionalData.map(data =>
            database.AdditionalDataSchema.create(
              {
                locationId: location.uuid,
                key: data.key,
                label: data.label,
                isRequired: data.isRequired,
              },
              { transaction }
            )
          )
        );
      }
    });

    response.status(status.CREATED);
    return response.send(location);
  }
);

// update location
router.patch(
  '/:locationId',
  requireOperator,
  requireNonDeletedUser,
  validateSchema(updateSchema),
  validateParametersSchema(locationIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        operator: request.user.uuid,
        uuid: request.params.locationId,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await location.update({
      name: location.name ? request.body.locationName : null,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      phone: request.body.phone,
      tableCount: request.body.tableCount,
      radius: request.body.radius || 0,
      shouldProvideGeoLocation: request.body.radius > 0,
      isIndoor: request.body.isIndoor,
    });

    return response.send(location);
  }
);

// delete location
router.delete(
  '/:locationId',
  validateParametersSchema(locationIdParametersSchema),
  requireOperator,
  requireNonDeletedUser,
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        operator: request.user.uuid,
        uuid: request.params.locationId,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await database.transaction(async transaction => {
      await database.Location.checkoutAllTraces({ location, transaction });
      await location.destroy({ transaction });
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// checkout all guest in a location
router.post(
  '/:locationId/check-out',
  validateParametersSchema(locationIdParametersSchema),
  requireOperator,
  requireNonDeletedUser,
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        operator: request.user.uuid,
        uuid: request.params.locationId,
      },
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await database.Location.checkoutAllTraces({ location });

    return response.sendStatus(status.NO_CONTENT);
  }
);

module.exports = router;
