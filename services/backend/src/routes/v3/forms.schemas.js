const { z } = require('../../middlewares/validateSchema');

const formIdParametersSchema = z.object({
  formId: z.string().uuid(),
});

module.exports = {
  formIdParametersSchema,
};
