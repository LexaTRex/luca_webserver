const { z } = require('../../../utils/validation');

const updateMailSchema = z.object({
  email: z.email(),
  lang: z.supportedLanguage(),
});

const activationSchema = z.object({
  activationId: z.uuid(),
});

const emailParametersSchema = z.object({
  email: z.email(),
});

module.exports = {
  updateMailSchema,
  activationSchema,
  emailParametersSchema,
};
