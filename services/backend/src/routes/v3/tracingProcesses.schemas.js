const { z } = require('../../middlewares/validateSchema');

const patchSchema = z.object({
  didRequestLocations: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

const tracingProcessIdParametersSchema = z.object({
  tracingProcessId: z.string().uuid(),
});

module.exports = {
  tracingProcessIdParametersSchema,
  patchSchema,
};
