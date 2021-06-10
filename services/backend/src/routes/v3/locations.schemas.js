const { z } = require('../../middlewares/validateSchema');

const locationIdParametersSchema = z.object({
  locationId: z.string().uuid(),
});

const privateEventCreateSchema = z.object({
  publicKey: z.string().length(88),
});

const locationTracesQuerySchema = z.object({
  duration: z.enum(['today', 'week']).optional(),
});

const accessIdParametersSchema = z.object({
  accessId: z.string().uuid(),
});

module.exports = {
  privateEventCreateSchema,
  locationTracesQuerySchema,
  locationIdParametersSchema,
  accessIdParametersSchema,
};
