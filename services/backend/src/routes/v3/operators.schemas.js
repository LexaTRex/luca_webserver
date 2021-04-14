const {
  z,
  passwordMeetsCriteria,
  supportedLanguagesEnum,
} = require('../../middlewares/validateSchema');

const createSchema = z.object({
  firstName: z.string().max(255),
  lastName: z.string().max(255),
  email: z.string().email().max(255),
  password: z.string().refine(value => passwordMeetsCriteria(value)),
  agreement: z.boolean(),
  lang: supportedLanguagesEnum,
});

const activationSchema = z.object({
  activationId: z.string().uuid(),
  lang: supportedLanguagesEnum,
});

const storePublicKeySchema = z.object({
  publicKey: z.string().length(88),
});

const updateOperatorSchema = z.object({
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
});
module.exports = {
  createSchema,
  activationSchema,
  storePublicKeySchema,
  updateOperatorSchema,
};
