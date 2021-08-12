const router = require('express').Router();
const status = require('http-status');

const database = require('../../../database');

const { formatLocationName } = require('../../../utils/format');
const {
  requireHealthDepartmentEmployee,
} = require('../../../middlewares/requireUser');
const {
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');
const { locationIdParametersSchema } = require('./locations.schemas');

router.get(
  '/:locationId',
  requireHealthDepartmentEmployee,
  validateParametersSchema(locationIdParametersSchema),
  async (request, response) => {
    const location = await database.Location.findOne({
      where: {
        uuid: request.params.locationId,
      },
      include: {
        model: database.LocationGroup,
      },
      paranoid: false,
    });

    if (!location) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const locationDTO = {
      isIndoor: location.isIndoor,
      type: location.type,
      locationId: location.uuid,
      groupName: location.LocationGroup?.name,
      groupType: location.LocationGroup?.type,
      locationName: location.name,
      name: formatLocationName(location, location.LocationGroup),
      firstName: location.firstName,
      lastName: location.lastName,
      phone: location.phone,
      streetName: location.streetName || '',
      streetNr: location.streetNr || '',
      zipCode: location.zipCode || '',
      city: location.city || '',
      state: location.state || '',
    };

    return response.send(locationDTO);
  }
);

module.exports = router;
