const { z } = require('../../middlewares/validateSchema');

const searchSchema = z.object({
  name: z.string().min(3).max(128),
  limit: z
    .string()
    .regex(/^\d{1,4}$/)
    .optional(),
  offset: z
    .string()
    .regex(/^\d{1,9}$/)
    .optional(),
});

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
  searchSchema,
  privateEventCreateSchema,
  locationTracesQuerySchema,
  locationIdParametersSchema,
  accessIdParametersSchema,
};
