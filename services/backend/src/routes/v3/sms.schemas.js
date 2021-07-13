const { z } = require('../../utils/validation');

const requestSchema = z.object({
  phone: z.phoneNumber(),
});

const verifySchema = z.object({
  challengeId: z.uuid(),
  tan: z.string().max(6),
});

const bulkVerifySchema = z.object({
  challengeIds: z.array(z.uuid()).min(1).max(10),
  tan: z.string().max(6),
});

module.exports = {
  requestSchema,
  verifySchema,
  bulkVerifySchema,
};
