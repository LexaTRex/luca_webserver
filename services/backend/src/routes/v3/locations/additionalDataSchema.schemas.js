const { z } = require('../../../middlewares/validateSchema');

const UNSAFE_PROPERTY_NAMES = Object.getOwnPropertyNames(Object.prototype);

const locationIdParametersSchema = z.object({
  locationId: z.string().uuid(),
});

const additionalDataParameters = z.object({
  additionalDataId: z.string().uuid(),
});

const additionalDataBody = z.object({
  key: z.string().refine(
    value => {
      if (value.startsWith('_')) return false;
      if (value in UNSAFE_PROPERTY_NAMES) return false;
      return true;
    },
    {
      message: 'Invalid additional data name.',
    }
  ),
  label: z.string().optional(),
  isRequired: z.boolean().optional(),
});

module.exports = {
  locationIdParametersSchema,
  additionalDataParameters,
  additionalDataBody,
};
