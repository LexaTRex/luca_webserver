const { z } = require('../../middlewares/validateSchema');

const createSchema = z.object({
  data: z.string().max(2048),
  iv: z.string().length(24),
  mac: z.string().length(44),
  publicKey: z.string().length(88),
  keyId: z.number().int().min(0).max(255),
});

const tanParametersSchema = z.object({
  tan: z.string(),
});

const userTransferIdParametersSchema = z.object({
  userTransferId: z.string().uuid(),
});

module.exports = {
  createSchema,
  tanParametersSchema,
  userTransferIdParametersSchema,
};
