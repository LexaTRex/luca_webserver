const { z } = require('../../utils/validation');

const scannerIdParametersSchema = z.object({
  scannerId: z.uuid(),
});

const scannerAccessIdParametersSchema = z.object({
  scannerAccessId: z.uuid(),
});

const checkinSchema = z.object({
  traceId: z.traceId(),
  scannerId: z.uuid(),
  timestamp: z.unixTimestamp(),
  data: z.base64({ max: 128 }),
  iv: z.iv(),
  mac: z.mac(),
  publicKey: z.ecPublicKey(),
  deviceType: z.deviceType(),
});

module.exports = {
  checkinSchema,
  scannerIdParametersSchema,
  scannerAccessIdParametersSchema,
};
