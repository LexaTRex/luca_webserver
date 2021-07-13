const { z } = require('../../utils/validation');

const storeSignedKeysSchema = z.object({
  publicCertificate: z.string().max(8192),
  signedPublicHDEKP: z.string().max(2048),
  signedPublicHDSKP: z.string().max(2048),
});

const departmentIdParametersSchema = z.object({
  departmentId: z.uuid(),
});

module.exports = {
  storeSignedKeysSchema,
  departmentIdParametersSchema,
};
