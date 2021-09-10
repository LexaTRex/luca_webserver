import { z } from 'utils/validation';

export const chunkIdParametersSchema = z.object({
  chunkId: z.base64({ rawLength: 16 }),
});
