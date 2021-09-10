const { z } = require('../../utils/validation');

const storeSignedKeysSchema = z.object({
  publicCertificate: z.string().max(8192),
  signedPublicHDEKP: z.string().max(2048),
  signedPublicHDSKP: z.string().max(2048),
});

const departmentIdParametersSchema = z.object({
  departmentId: z.uuid(),
});

const auditLogDownloadQuerySchema = z.object({
  timeframe: z.array(z.string()).length(2),
});

module.exports = {
  storeSignedKeysSchema,
  departmentIdParametersSchema,
  auditLogDownloadQuerySchema,
};
