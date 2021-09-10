const { z } = require('../../utils/validation');

const storeKeysSchema = z.object({
  publicHDEKP: z.ecPublicKey(),
  publicHDSKP: z.ecPublicKey(),
});

const departmentIdParametersSchema = z.object({
  departmentId: z.uuid(),
});

const contactParametersSchema = z.object({
  email: z.email().optional(),
  phone: z.phoneNumber().optional(),
});

module.exports = {
  storeKeysSchema,
  departmentIdParametersSchema,
  contactParametersSchema,
};
