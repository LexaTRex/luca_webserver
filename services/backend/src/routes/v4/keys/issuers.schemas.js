const { z } = require('../../../middlewares/validateSchema');

const issuerIdParametersSchema = z.object({
  issuerId: z.string().uuid(),
});

module.exports = {
  issuerIdParametersSchema,
};
