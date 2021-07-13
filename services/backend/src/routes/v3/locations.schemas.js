const { z } = require('../../utils/validation');

const locationIdParametersSchema = z.object({
  locationId: z.uuid(),
});

const privateEventCreateSchema = z.object({
  publicKey: z.ecPublicKey(),
});

const locationTracesQuerySchema = z.object({
  duration: z.enum(['today', 'week']).optional(),
});

const accessIdParametersSchema = z.object({
  accessId: z.uuid(),
});

module.exports = {
  privateEventCreateSchema,
  locationTracesQuerySchema,
  locationIdParametersSchema,
  accessIdParametersSchema,
};
