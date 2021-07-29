const { z } = require('../../utils/validation');

const formIdParametersSchema = z.object({
  formId: z.uuid(),
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
  formIdParametersSchema,
};
