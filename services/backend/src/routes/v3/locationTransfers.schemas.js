const {
  z,
  supportedLanguagesEnum,
} = require('../../middlewares/validateSchema');

const createSchema = z.object({
  locations: z
    .array(
      z.object({
        time: z.array(z.number().int().positive()).length(2),
        locationId: z.string().uuid(),
      })
    )
    .nonempty(),
  userTransferId: z.string().uuid().optional(),
  lang: supportedLanguagesEnum,
});

const sendSchema = z.object({
  traces: [
    {
      traceId: z.string().length(24),
      data: z.string().length(44),
      publicKey: z.string().length(88),
      keyId: z.number().int().min(0),
      version: z.number().int().optional(),
      verification: z.string().length(24),
      deviceType: z.number().int().min(0),
      additionalData: z
        .object({
          data: z.string().max(1024),
          publicKey: z.string().length(88),
          mac: z.string().length(44),
          iv: z.string().length(24),
        })
        .optional(),
    },
  ],
});

const transferIdParametersSchema = z.object({
  transferId: z.string().uuid(),
});

module.exports = {
  createSchema,
  sendSchema,
  transferIdParametersSchema,
};
