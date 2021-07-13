const { z } = require('../../utils/validation');

const formIdParametersSchema = z.object({
  formId: z.uuid(),
});

module.exports = {
  formIdParametersSchema,
};
