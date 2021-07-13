const { z } = require('../../../utils/validation');

const issuerIdParametersSchema = z.object({
  issuerId: z.uuid(),
});

module.exports = {
  issuerIdParametersSchema,
};
