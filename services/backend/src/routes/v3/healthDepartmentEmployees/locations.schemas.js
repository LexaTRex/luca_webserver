const { z } = require('../../../utils/validation');

const locationIdParametersSchema = z.object({
  locationId: z.uuid(),
});

module.exports = {
  locationIdParametersSchema,
};
