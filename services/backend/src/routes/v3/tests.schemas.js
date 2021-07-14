const { z } = require('../../utils/validation');

const redeemSchema = z.object({
  hash: z.base64({ length: 44, rawLength: 32 }),
  tag: z.base64({ length: 24, rawLength: 16 }),
  expireAt: z.unixTimestamp().optional(),
});

module.exports = {
  redeemSchema,
};
