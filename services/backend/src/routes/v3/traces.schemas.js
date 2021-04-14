const { z } = require('../../middlewares/validateSchema');

const checkinSchema = z.object({
  traceId: z.string().length(24),
  scannerId: z.string().uuid(),
  timestamp: z.number().int().positive(),
  data: z.string().max(128),
  iv: z.string().length(24),
  mac: z.string().length(44),
  publicKey: z.string().length(88),
  deviceType: z.number().int().min(0),
});

const checkoutSchema = z.object({
  traceId: z.string().length(24),
  timestamp: z.number().int().positive(),
});

const additionalDataSchema = z.object({
  traceId: z.string().length(24),
  data: z.string().max(4096),
  iv: z.string().length(24),
  mac: z.string().length(44),
  publicKey: z.string().length(88),
});

const bulkSchema = z.object({
  traceIds: z.array(z.string().length(24)).max(360),
});

const traceIdParametersSchema = z.object({
  traceId: z
    .string()
    .regex(/^[\da-f]+$/)
    .length(32),
});

const traceSchema = z
  .object({
    userId: z.string().uuid(),
    userTracingSecret: z.string().length(24).optional(),
    userTracingSecrets: z
      .array(
        z.object({
          s: z.string().length(24),
          ts: z.number().int().positive(),
        })
      )
      .max(28)
      .optional(),
  })
  .refine(value => {
    // either has to exist
    return value.userTracingSecret || value.userTracingSecrets;
  });

module.exports = {
  checkoutSchema,
  checkinSchema,
  additionalDataSchema,
  bulkSchema,
  traceIdParametersSchema,
  traceSchema,
};
