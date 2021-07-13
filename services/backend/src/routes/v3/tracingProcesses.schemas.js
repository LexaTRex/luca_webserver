const { z } = require('../../utils/validation');

const patchSchema = z.object({
  didRequestLocations: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
  assigneeId: z.uuid().nullable().optional(),
});

const tracingProcessIdParametersSchema = z.object({
  tracingProcessId: z.uuid(),
});

module.exports = {
  tracingProcessIdParametersSchema,
  patchSchema,
};
