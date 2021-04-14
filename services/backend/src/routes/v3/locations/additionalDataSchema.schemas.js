const { z } = require('../../../middlewares/validateSchema');

const locationIdParametersSchema = z.object({
  locationId: z.string().uuid(),
});

const additionalDataParameters = z.object({
  additionalDataId: z.string().uuid(),
});

const additionalDataBody = z.object({
  key: z.string().refine(value => !value.startsWith('_'), {
    message: 'Additional data cannot start with underscore.',
  }),
  label: z.string().optional(),
  isRequired: z.boolean().optional(),
});

module.exports = {
  locationIdParametersSchema,
  additionalDataParameters,
  additionalDataBody,
};
