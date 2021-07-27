const { z } = require('../../../utils/validation');

const changePasswordSchema = z.object({
  currentPassword: z.string().max(255),
  newPassword: z.strongPassword(),
  lang: z.supportedLanguage(),
});

const renewSchema = z.object({
  employeeId: z.uuid(),
});

module.exports = {
  changePasswordSchema,
  renewSchema,
};
