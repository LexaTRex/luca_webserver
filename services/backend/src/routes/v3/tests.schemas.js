const { z } = require('../../middlewares/validateSchema');

const redeemSchema = z.object({
  hash: z.string().length(44),
  tag: z.string().length(24),
  expireAt: z.number().int().positive().optional(),
});

module.exports = {
  redeemSchema,
};
