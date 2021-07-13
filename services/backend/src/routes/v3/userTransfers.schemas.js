const { z } = require('../../utils/validation');

const createSchema = z.object({
  data: z.base64({ max: 2048 }),
  iv: z.iv(),
  mac: z.mac(),
  publicKey: z.ecPublicKey(),
  keyId: z.dailyKeyId(),
});

const tanParametersSchema = z.object({
  tan: z.string().max(12),
});

const userTransferIdParametersSchema = z.object({
  userTransferId: z.uuid(),
});

module.exports = {
  createSchema,
  tanParametersSchema,
  userTransferIdParametersSchema,
};
