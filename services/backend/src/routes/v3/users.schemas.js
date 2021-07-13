const { z } = require('../../utils/validation');

const createSchema = z.object({
  data: z.base64({ max: 1024 }),
  iv: z.iv(),
  mac: z.mac(),
  signature: z.ecSignature(),
  publicKey: z.ecPublicKey(),
});

const userIdParametersSchema = z.object({
  userId: z.uuid(),
});

const patchSchema = z.object({
  data: z.base64({ max: 1024 }),
  iv: z.iv(),
  mac: z.mac(),
  signature: z.ecSignature(),
});

const deleteSchema = z.object({
  signature: z.ecSignature(),
});

module.exports = {
  createSchema,
  userIdParametersSchema,
  patchSchema,
  deleteSchema,
};
