const { z } = require('../../utils/validation');

const badgeCreateSchema = z.object({
  userId: z.uuid(),
  publicKey: z.ecPublicKey(),
  data: z.base64({ rawLength: 32 }),
  signature: z.ecSignature(),
});

module.exports = { badgeCreateSchema };
