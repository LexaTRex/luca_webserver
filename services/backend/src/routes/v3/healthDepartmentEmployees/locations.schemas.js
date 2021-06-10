const { z } = require('../../../middlewares/validateSchema');

const locationIdParametersSchema = z.object({
  locationId: z.string().uuid(),
});

module.exports = {
  locationIdParametersSchema,
};
