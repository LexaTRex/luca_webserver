const { z } = require('../../middlewares/validateSchema');

const zipParametersSchema = z.object({
  zipCode: z.string(),
});

module.exports = {
  zipParametersSchema,
};
