const { z } = require('../../utils/validation');

const checkinSchema = z.object({
  traceId: z.traceId(),
  scannerId: z.uuid(),
  timestamp: z.unixTimestamp(),
  data: z.base64({ max: 128 }),
  iv: z.iv(),
  mac: z.mac(),
  publicKey: z.ecPublicKey(),
  deviceType: z.number().int().min(0),
});

const checkoutSchema = z.object({
  traceId: z.traceId(),
  timestamp: z.unixTimestamp(),
});

const additionalDataSchema = z.object({
  traceId: z.traceId(),
  data: z.base64({ max: 4096 }),
  iv: z.iv(),
  mac: z.mac(),
  publicKey: z.ecPublicKey(),
});

const bulkSchema = z.object({
  traceIds: z.array(z.traceId()).max(360),
});

const traceIdParametersSchema = z.object({
  traceId: z
    .string()
    .regex(/^[\da-f]+$/)
    .length(32),
});

const maxTracesPerDay = 1500; // rounded up from 60 [minutes] * 24 [hours]
const numberOfDays = 14;
const traceSchema = z.object({
  traceIds: z.array(z.traceId()).max(maxTracesPerDay * numberOfDays),
});

module.exports = {
  checkoutSchema,
  checkinSchema,
  additionalDataSchema,
  bulkSchema,
  traceIdParametersSchema,
  traceSchema,
};
