/* eslint-disable max-lines */

const router = require('express').Router();
const status = require('http-status');
const { Op } = require('sequelize');

const {
  createSchema,
  searchSchema,
  groupIdSchema,
  updateSchema,
} = require('./locationGroups.schemas');

const database = require('../../database');
const {
  validateSchema,
  validateParametersSchema,
  validateQuerySchema,
} = require('../../middlewares/validateSchema');

const {
  requireOperator,
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');

// HD search for location group
router.get(
  '/search',
  requireHealthDepartmentEmployee,
  validateQuerySchema(searchSchema),
  async (request, response) => {
    const limit = Number.parseInt(request.query.limit, 10);
    const offset = Number.parseInt(request.query.offset, 10);

    const groups = await database.LocationGroup.findAll({
      where: {
        name: {
          [Op.iLike]: `%${request.query.name}%`,
        },
      },
      include: [
        {
          model: database.Operator,
          attributes: ['uuid', 'email'],
        },
        {
          model: database.Location,
          attributes: [
            'uuid',
            'name',
            'streetName',
            'streetNr',
            'zipCode',
            'city',
          ],
        },
      ],
      limit: limit || 10,
      offset: offset || 0,
    });

    return response.send(
      groups.map(group => ({
        groupId: group.uuid,
        name: group.name,
        operator: group.Operator,
        baseLocation: group.Locations.find(location => !location.name),
        locations: group.Locations.map(location => location.uuid),
      }))
    );
  }
);

// create location group
router.post(
  '/',
  requireOperator,
  validateSchema(createSchema),
  async (request, response) => {
    const operator = await database.Operator.findOne({
      where: {
        uuid: request.user.uuid,
      },
    });

    if (!operator) {
      return response.sendStatus(status.NOT_FOUND);
    }

    let group;
    let location;

    await database.transaction(async transaction => {
      group = await database.LocationGroup.create(
        {
          name: request.body.name,
          operatorId: request.user.uuid,
          type: request.body.type,
        },
        { transaction }
      );

      location = await database.Location.create(
        {
          operator: request.user.uuid,
          groupId: group.uuid,
          publicKey: operator.publicKey,
          name: null,
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
          type: request.body.type,
          isIndoor: request.body.isIndoor,
        },
        { transaction }
      );

      if (request.body.additionalData) {
        await Promise.all(
          request.body.additionalData.map(data =>
            database.AdditionalDataSchema.create(
              {
                locationId: location.uuid,
                ...data,
              },
              { transaction }
            )
          )
        );
      }

      if (request.body.areas) {
        await Promise.all(
          request.body.areas.map(area =>
            database.Location.create(
              {
                operator: request.user.uuid,
                groupId: group.uuid,
                publicKey: operator.publicKey,
                name: area.name,
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
                isIndoor: area.isIndoor,
                type: request.body.type,
              },
              { transaction }
            )
          )
        );
      }
    });

    response.status(status.CREATED);
    return response.send({
      groupId: group.uuid,
      name: group.name,
      location: {
        scannerId: location.scannerId,
        tableCount: location.tableCount,
        locationId: location.uuid,
      },
    });
  }
);

// get all location groups
router.get('/', requireOperator, async (request, response) => {
  const groups = await database.LocationGroup.findAll({
    where: { operatorId: request.user.uuid },
    order: [['name', 'ASC']],
    include: {
      model: database.Location,
      attributes: ['uuid', 'name'],
      order: [['name', 'ASC']],
    },
  });

  response.send(
    groups.map(group => ({
      groupId: group.uuid,
      name: group.name,
      locations: group.Locations,
    }))
  );
});

// get a single location group
router.get(
  '/:groupId',
  validateParametersSchema(groupIdSchema),
  async (request, response) => {
    const group = await database.LocationGroup.findOne({
      where: { uuid: request.params.groupId },
      include: {
        model: database.Location,
        attributes: [
          'uuid',
          'name',
          'streetName',
          'streetNr',
          'city',
          'zipCode',
          'phone',
          'lat',
          'lng',
        ],
        order: [['name', 'ASC']],
      },
    });

    if (!group) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      groupId: group.uuid,
      operatorId: group.operatorId,
      name: group.name,
      locations: group.Locations,
    });
  }
);

// update location group
router.patch(
  '/:groupId',
  requireOperator,
  validateParametersSchema(groupIdSchema),
  validateSchema(updateSchema),
  async (request, response) => {
    const group = await database.LocationGroup.findOne({
      where: { uuid: request.params.groupId, operatorId: request.user.uuid },
    });

    if (!group) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const baseLocation = await database.Location.findOne({
      where: { groupId: request.params.groupId, name: null },
    });

    if (!baseLocation) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await database.transaction(async transaction => {
      return Promise.all([
        baseLocation.update(
          {
            phone: request.body.phone,
          },
          { transaction }
        ),
        group.update(
          {
            name: request.body.name,
          },
          { transaction }
        ),
      ]);
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// delete location group
router.delete(
  '/:groupId',
  requireOperator,
  validateParametersSchema(groupIdSchema),
  async (request, response) => {
    const group = await database.LocationGroup.findOne({
      where: {
        uuid: request.params.groupId,
        operatorId: request.user.uuid,
      },
      include: {
        model: database.Location,
      },
    });

    if (!group) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await group.destroy();
    for (const location of group.Locations) {
      await location.destroy();
    }

    return response.sendStatus(status.NO_CONTENT);
  }
);

module.exports = router;
