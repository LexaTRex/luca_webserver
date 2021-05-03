const { z } = require('../../middlewares/validateSchema');

const createSchema = z.object({
  type: z.string().max(128),
  name: z.string().max(255),
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  phone: z.string().max(255),
  streetName: z.string().max(255),
  streetNr: z.string().max(255),
  zipCode: z.string().max(255),
  city: z.string().max(255),
  state: z.string().max(255).optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  radius: z.number().int().nonnegative().optional().nullable(),
  tableCount: z.number().int().positive().optional().nullable(),
  additionalData: z
    .array(
      z.object({
        key: z.string(),
        label: z.string().optional(),
        isRequired: z.boolean().optional(),
      })
    )
    .optional(),
  areas: z
    .array(
      z.object({
        name: z.string(),
        isIndoor: z.boolean(),
      })
    )
    .optional(),
  isIndoor: z.boolean(),
});

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

const groupIdSchema = z.object({
  groupId: z.string().uuid(),
});

const updateSchema = z.object({
  name: z.string().max(255).optional(),
  phone: z.string().max(255).optional(),
});

module.exports = {
  createSchema,
  searchSchema,
  groupIdSchema,
  updateSchema,
};
