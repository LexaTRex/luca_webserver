const { DownloadTracesType } = require('../../utils/hdAuditLog');
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

const auditLogDownloadEventSchema = z.object({
  type: z.nativeEnum(DownloadTracesType),
  transferId: z.uuid(),
  amount: z.number(),
});

const auditLogExportEventSchema = z.object({
  transferId: z.uuid(),
  amount: z.number(),
});

module.exports = {
  storeSignedKeysSchema,
  departmentIdParametersSchema,
  auditLogDownloadQuerySchema,
  auditLogDownloadEventSchema,
  auditLogExportEventSchema,
};
