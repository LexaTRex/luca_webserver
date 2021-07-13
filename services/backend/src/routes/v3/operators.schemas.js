const { z } = require('../../utils/validation');

const createSchema = z.object({
  firstName: z.safeString().max(255),
  lastName: z.safeString().max(255),
  email: z.email(),
  password: z.strongPassword(),
  agreement: z.boolean(),
  avvAccepted: z.literal(true),
  lastVersionSeen: z.string().max(32).optional(),
  lang: z.supportedLanguage(),
});

const activationSchema = z.object({
  activationId: z.uuid(),
  lang: z.supportedLanguage(),
});

const storePublicKeySchema = z.object({
  publicKey: z.ecPublicKey(),
});

const updateOperatorSchema = z.object({
  firstName: z.safeString().max(255).optional(),
  lastName: z.safeString().max(255).optional(),
  avvAccepted: z.boolean().optional(),
  lastVersionSeen: z.string().max(32).optional(),
});
module.exports = {
  createSchema,
  activationSchema,
  storePublicKeySchema,
  updateOperatorSchema,
};
