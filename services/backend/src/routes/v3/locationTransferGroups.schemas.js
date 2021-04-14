const { z } = require('../../middlewares/validateSchema');

const groupIdParametersSchema = z.object({
  groupId: z.string().uuid(),
});

module.exports = {
  groupIdParametersSchema,
};
