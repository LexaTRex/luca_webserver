const { z } = require('../../utils/validation');

const authSchema = z.object({
  username: z.email(),
  password: z.string().max(255),
});

module.exports = {
  authSchema,
};
