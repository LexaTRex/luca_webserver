const { z } = require('../../middlewares/validateSchema');

const parametersSchema = z.object({
  registratorId: z.string().uuid(),
});

module.exports = {
  parametersSchema,
};
