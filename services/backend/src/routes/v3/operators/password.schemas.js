const { z } = require('../../../utils/validation');

const changePasswordSchema = z.object({
  currentPassword: z.string().max(255),
  newPassword: z.strongPassword(),
});

const forgotPasswordSchema = z.object({
  email: z.email(),
  lang: z.supportedLanguage(),
});

const resetPasswordSchema = z.object({
  resetId: z.uuid(),
  newPassword: z.strongPassword(),
});

const resetRequestSchema = z.object({
  resetId: z.uuid(),
});

module.exports = {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetRequestSchema,
};
