const { z } = require('../../utils/validation');

const patchSchema = z
  .object({
    didRequestLocations: z.boolean().optional(),
    isCompleted: z.boolean().optional(),
    assigneeId: z.uuid().nullable().optional(),
    note: z.base64({ max: 1000 }).optional(),
    noteIV: z.iv().optional(),
    noteMAC: z.mac().optional(),
    noteSignature: z.ecSignature().optional(),
    notePublicKey: z.ecPublicKey().optional(),
  })
  .refine(value => {
    // check if note property exists all other required properties also exist
    return value.note
      ? [
          'noteIV',
          'noteMAC',
          'noteSignature',
          'notePublicKey',
        ].every(property => Object.hasOwn(value, property))
      : true;
  });

const tracingProcessIdParametersSchema = z.object({
  tracingProcessId: z.uuid(),
});

module.exports = {
  tracingProcessIdParametersSchema,
  patchSchema,
};
