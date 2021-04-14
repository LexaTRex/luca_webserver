const { z } = require('../../middlewares/validateSchema');

const createSchema = z.object({
  email: z.string().email().max(255),
  firstName: z.string().max(255),
  lastName: z.string().max(255),
  phone: z.string().max(255),
});

module.exports = {
  createSchema,
};
