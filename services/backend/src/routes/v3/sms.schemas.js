const { z } = require('../../middlewares/validateSchema');

const requestSchema = z.object({
  phone: z.telephoneNumber(),
});

const verifySchema = z.object({
  challengeId: z.string().uuid(),
  tan: z.string().max(6),
});

const bulkVerifySchema = z.object({
  challengeIds: z.array(z.string().uuid()).min(1).max(10),
  tan: z.string().max(6),
});

module.exports = {
  requestSchema,
  verifySchema,
  bulkVerifySchema,
};
