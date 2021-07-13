const { z } = require('../../utils/validation');

const storeKeysSchema = z.object({
  publicHDEKP: z.ecPublicKey(),
  publicHDSKP: z.ecPublicKey(),
});

const departmentIdParametersSchema = z.object({
  departmentId: z.uuid(),
});

module.exports = {
  storeKeysSchema,
  departmentIdParametersSchema,
};
