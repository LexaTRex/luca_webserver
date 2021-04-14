const { z } = require('../../middlewares/validateSchema');

const authSchema = z.object({
  username: z.string().email(),
  password: z.string().max(255),
});

module.exports = {
  authSchema,
};
