const { z } = require('../../../utils/validation');

const UNSAFE_PROPERTY_NAMES = Object.getOwnPropertyNames(Object.prototype);

const locationIdParametersSchema = z.object({
  locationId: z.uuid(),
});

const additionalDataParameters = z.object({
  additionalDataId: z.uuid(),
});

const additionalDataBody = z.object({
  key: z
    .safeString()
    .max(255)
    .refine(
      value => {
        if (value.startsWith('_')) return false;
        if (value in UNSAFE_PROPERTY_NAMES) return false;
        return true;
      },
      {
        message: 'Invalid additional data name.',
      }
    ),
  label: z.safeString().max(255).optional(),
  isRequired: z.boolean().optional(),
});

module.exports = {
  locationIdParametersSchema,
  additionalDataParameters,
  additionalDataBody,
};
