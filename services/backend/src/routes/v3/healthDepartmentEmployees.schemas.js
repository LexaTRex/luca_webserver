const { z } = require('../../utils/validation');

const getSchema = z.object({
  includeDeleted: z.enum(['true', 'false']).optional(),
});

const createSchema = z.object({
  email: z.email(),
  firstName: z.safeString().max(255),
  lastName: z.safeString().max(255),
  phone: z.safeString().max(255),
});

const updateSchema = z.object({
  isAdmin: z.boolean().optional(),
  firstName: z.safeString().max(255).optional(),
  lastName: z.safeString().max(255).optional(),
  phone: z.safeString().max(255).optional(),
});

const employeeIdParametersSchema = z.object({
  employeeId: z.uuid(),
});

module.exports = {
  getSchema,
  createSchema,
  updateSchema,
  employeeIdParametersSchema,
};
