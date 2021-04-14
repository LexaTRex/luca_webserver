const { z } = require('../../middlewares/validateSchema');

const storeKeysSchema = z.object({
  publicHDEKP: z.string().length(88),
  publicHDSKP: z.string().length(88),
});

const departmentIdParametersSchema = z.object({
  issuerId: z.string().uuid(),
});

module.exports = {
  storeKeysSchema,
  departmentIdParametersSchema,
};
