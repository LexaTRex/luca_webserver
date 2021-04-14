const { z } = require('../../../middlewares/validateSchema');

const createSchema = z.object({
  groupId: z.string().uuid(),
  locationName: z.string().max(255),
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
});

const updateSchema = z.object({
  locationName: z.string().max(255).optional(),
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  phone: z.string().max(255).optional(),
  tableCount: z.number().int().positive().optional().nullable(),
  shouldProvideGeoLocation: z.boolean().optional(),
  radius: z.number().optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
