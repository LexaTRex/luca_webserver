const { z } = require('../../middlewares/validateSchema');

const traceIdSchema = z.string().length(24);

const checkinSchema = z.object({
  traceId: traceIdSchema,
  scannerId: z.string().uuid(),
  timestamp: z.number().int().positive(),
  data: z.string().max(128),
  iv: z.string().length(24),
  mac: z.string().length(44),
  publicKey: z.string().length(88),
  deviceType: z.number().int().min(0),
});

const checkoutSchema = z.object({
  traceId: traceIdSchema,
  timestamp: z.number().int().positive(),
});

const additionalDataSchema = z.object({
  traceId: traceIdSchema,
  data: z.string().max(4096),
  iv: z.string().length(24),
  mac: z.string().length(44),
  publicKey: z.string().length(88),
});

const bulkSchema = z.object({
  traceIds: z.array(traceIdSchema).max(360),
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
  traceIds: z.array(traceIdSchema).max(maxTracesPerDay * numberOfDays),
});

module.exports = {
  checkoutSchema,
  checkinSchema,
  additionalDataSchema,
  bulkSchema,
  traceIdParametersSchema,
  traceSchema,
};
