/**
 * @overview Provides endpoints allowing operators to register/update/delete their venue and to
 * check-out all guests at once
 *
 * @see https://www.luca-app.de/securityoverview/processes/venue_registration.html
 * @see https://www.luca-app.de/securityoverview/properties/actors.html#term-Venue-Owner
 */

/* eslint-disable sonarjs/no-duplicate-string */
const router = require('express').Router();
const status = require('http-status');
const { Op } = require('sequelize');

const {
  createSchema,
  updateSchema,
  locationIdParametersSchema,
} = require('./locations.schemas');
const { getOperatorLocationDTO } = require('./locations.helper');

const database = require('../../../database');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');
const {
  requireOperator,
  requireNonDeletedUser,
} = require('../../../middlewares/requireUser');

/**
 * Get all locations (venues) operated by the currently logged-in owner
 */
router.get('/', requireOperator, async (request, response) => {
  const locations = await database.Location.findAll({
    where: {
      operator: request.user.uuid,
    },
  });
  response.send(locations.map(location => getOperatorLocationDTO(location)));
});

/**
 * Get specific location (venue). Requires the logged-in user to be the operator of said location
 */
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

    return response.send(getOperatorLocationDTO(location));
  }
);

/**
 * Create a new location (venue). The venue's private key will remain in the venue frontend
 * @see https://www.luca-app.de/securityoverview/processes/venue_registration.html
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-venue-keypair
 */
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

    const trimmedLocationName = request.body.locationName.trim();
    const existingLocation = await database.Location.findOne({
      where: {
        name: trimmedLocationName,
        groupId: request.body.groupId,
      },
    });

    if (existingLocation) {
      return response.sendStatus(status.CONFLICT);
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
          name: trimmedLocationName,
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
          averageCheckinTime: request.body.averageCheckinTime || null,
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
    return response.send(getOperatorLocationDTO(location));
  }
);

/**
 * Update given location, owned by the logged-in operator
 * @param locationId of the venue to update
 */
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

    if (request.body.locationName) {
      const existingLocation = await database.Location.findOne({
        where: {
          name: request.body.locationName.trim(),
          groupId: location.groupId,
          uuid: {
            [Op.not]: request.params.locationId,
          },
        },
      });
      if (existingLocation) {
        return response.sendStatus(status.CONFLICT);
      }
    }

    await location.update({
      name: location.name ? request.body.locationName?.trim() : null,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      phone: request.body.phone,
      tableCount: request.body.tableCount,
      radius: request.body.radius || 0,
      shouldProvideGeoLocation: request.body.radius > 0,
      isIndoor: request.body.isIndoor,
      averageCheckinTime: request.body.averageCheckinTime,
    });

    return response.send(getOperatorLocationDTO(location));
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

/**
 * Check-out all guests of a given venue
 * @param locationId of the venue
 */
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
