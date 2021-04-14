const {
  passwordMeetsCriteria,
  supportedLanguagesEnum,
  z,
} = require('../../../middlewares/validateSchema');

const changePasswordSchema = z.object({
  currentPassword: z.string().max(255),
  newPassword: z.string().refine(password => passwordMeetsCriteria(password)),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().max(255),
  lang: supportedLanguagesEnum,
});

const resetPasswordSchema = z.object({
  resetId: z.string().uuid(),
  newPassword: z.string().refine(password => passwordMeetsCriteria(password)),
});

const resetRequestSchema = z.object({
  resetId: z.string().uuid(),
});

module.exports = {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetRequestSchema,
};
