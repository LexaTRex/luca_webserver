const {
  z,
  supportedLanguagesEnum,
} = require('../../../middlewares/validateSchema');

const updateMailSchema = z.object({
  email: z.string().email().max(255),
  lang: supportedLanguagesEnum,
});

const activationSchema = z.object({
  activationId: z.string().uuid(),
});

const emailParametersSchema = z.object({
  email: z.string().email().max(255),
});

module.exports = {
  updateMailSchema,
  activationSchema,
  emailParametersSchema,
};
