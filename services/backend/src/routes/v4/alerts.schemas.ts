import { z } from 'utils/validation';

export const triggerKeyMismatchSchema = z.object({
  keyId: z.dailyKeyId(),
  expected: z.ecPublicKey(),
  received: z.ecPublicKey(),
});
