const { z } = require('../../utils/validation');

const createSchema = z.object({
  type: z.safeString().max(128),
  name: z.safeString().max(255),
  firstName: z.safeString().max(255).optional(),
  lastName: z.safeString().max(255).optional(),
  phone: z.phoneNumber(),
  streetName: z.safeString().max(255),
  streetNr: z.safeString().max(255),
  zipCode: z.zipCode(),
  city: z.safeString().max(255),
  state: z.safeString().max(255).optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  radius: z.number().int().nonnegative().optional().nullable(),
  tableCount: z.number().int().positive().max(1000).optional().nullable(),
  additionalData: z
    .array(
      z.object({
        key: z.safeString().max(255),
        label: z.safeString().max(255).optional(),
        isRequired: z.boolean().optional(),
      })
    )
    .optional(),
  areas: z
    .array(
      z.object({
        name: z.safeString().max(255),
        isIndoor: z.boolean(),
      })
    )
    .max(20)
    .optional(),
  isIndoor: z.boolean(),
  averageCheckinTime: z
    .number()
    .int()
    .positive()
    .max(1440)
    .min(15)
    .optional()
    .nullable(),
});

const searchSchema = z.object({
  name: z.string().min(3).max(128),
  zipCode: z.zipCode().optional(),
  limit: z.integerString().optional(),
  offset: z.integerString().optional(),
});

const groupIdSchema = z.object({
  groupId: z.uuid(),
});

const updateSchema = z.object({
  name: z.safeString().max(255).optional(),
  phone: z.phoneNumber().optional(),
});

module.exports = {
  createSchema,
  searchSchema,
  groupIdSchema,
  updateSchema,
};
