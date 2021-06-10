const { z } = require('../../middlewares/validateSchema');

const badgeCreateSchema = z.object({
  userId: z.string().uuid(),
  publicKey: z.string().max(88),
  data: z.string().length(44),
  signature: z.string().max(96),
});

module.exports = { badgeCreateSchema };
