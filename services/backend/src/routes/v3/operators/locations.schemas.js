const { z } = require('../../../utils/validation');

const createSchema = z.object({
  groupId: z.uuid(),
  locationName: z.safeString().max(255),
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
  radius: z.number().int().nonnegative().max(5000).optional().nullable(),
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
  isIndoor: z.boolean().optional(),
  type: z.safeString().max(128),
  averageCheckinTime: z
    .number()
    .int()
    .positive()
    .max(1440)
    .min(15)
    .optional()
    .nullable(),
});

const updateSchema = z.object({
  locationName: z.safeString().max(255).optional(),
  firstName: z.safeString().max(255).optional(),
  lastName: z.safeString().max(255).optional(),
  phone: z.phoneNumber().optional(),
  tableCount: z.number().int().positive().max(1000).optional().nullable(),
  radius: z.number().int().nonnegative().max(5000).optional().nullable(),
  isIndoor: z.boolean().optional(),
  averageCheckinTime: z
    .number()
    .int()
    .positive()
    .max(1440)
    .min(15)
    .optional()
    .nullable(),
});

const updateAddressSchema = z.object({
  streetName: z.safeString().max(255).optional(),
  streetNr: z.safeString().max(255).optional(),
  zipCode: z.zipCode().optional(),
  city: z.safeString().max(255).optional(),
  state: z.safeString().max(255).optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  radius: z.number().optional(),
});

const locationIdParametersSchema = z.object({
  locationId: z.uuid(),
});

const locationTracesQuerySchema = z.object({
  duration: z.enum(['today', 'week']).optional(),
});

module.exports = {
  createSchema,
  updateSchema,
  locationIdParametersSchema,
  updateAddressSchema,
  locationTracesQuerySchema,
};
