const { z } = require('../../utils/validation');

const zipParametersSchema = z.object({
  zipCode: z.zipCode(),
});

module.exports = {
  zipParametersSchema,
};
