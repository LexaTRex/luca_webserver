const { z } = require('../../middlewares/validateSchema');

const createSchema = z.object({
  data: z.string().max(1024),
  iv: z.string().length(24),
  mac: z.string().length(44),
  signature: z.string().max(96),
  publicKey: z.string().length(88),
});

const badgeCreateSchema = z.object({
  userId: z.string().uuid(),
  publicKey: z.string().max(88),
  data: z.string().length(44),
  signature: z.string().max(96),
});

const userIdParametersSchema = z.object({
  userId: z.string().uuid(),
});

const patchSchema = z.object({
  data: z.string().max(1024),
  iv: z.string().length(24),
  mac: z.string().length(44),
  signature: z.string().max(96),
});

const deleteSchema = z.object({
  signature: z.string().max(96),
});

module.exports = {
  createSchema,
  badgeCreateSchema,
  userIdParametersSchema,
  patchSchema,
  deleteSchema,
};
