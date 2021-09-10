const config = require('config');
const { z } = require('../../../utils/validation');

const keyIdParametersSchema = z.object({
  keyId: z.integerString(),
});

const rotateSchema = z.object({
  publicKey: z.ecPublicKey(),
  signature: z.ecSignature(),
  createdAt: z.unixTimestamp(),
  keyId: z.dailyKeyId(),
  encryptedDailyPrivateKeys: z
    .array(
      z.object({
        healthDepartmentId: z.uuid(),
        data: z.base64({ rawLength: 32 }),
        iv: z.iv(),
        mac: z.mac(),
        publicKey: z.ecPublicKey(),
        signature: z.ecSignature(),
      })
    )
    .max(config.get('luca.healthDepartments.maxAmount')),
});
const rekeySchema = z.object({
  keyId: z.dailyKeyId(),
  createdAt: z.unixTimestamp(),
  encryptedDailyPrivateKeys: z
    .array(
      z.object({
        healthDepartmentId: z.uuid(),
        data: z.base64({ rawLength: 32 }),
        iv: z.iv(),
        mac: z.mac(),
        publicKey: z.ecPublicKey(),
        signature: z.ecSignature(),
      })
    )
    .max(config.get('luca.healthDepartments.maxAmount')),
});

module.exports = {
  keyIdParametersSchema,
  rotateSchema,
  rekeySchema,
};
