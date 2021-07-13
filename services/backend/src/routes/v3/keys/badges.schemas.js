const { z } = require('../../../utils/validation');

const keyIdParametersSchema = z.object({
  keyId: z.integerString(),
});

const rotateSchema = z.object({
  publicKey: z.ecPublicKey(),
  signature: z.ecSignature(),
  createdAt: z.unixTimestamp(),
  keyId: z.number().int().min(0),
  encryptedBadgePrivateKeys: z.array(
    z.object({
      healthDepartmentId: z.uuid(),
      data: z.base64({ rawLength: 32 }),
      iv: z.iv(),
      mac: z.mac(),
      publicKey: z.ecPublicKey(),
      signature: z.ecSignature(),
    })
  ),
});

const rekeySchema = z.object({
  keyId: z.badgeKeyId(),
  createdAt: z.unixTimestamp(),
  encryptedBadgePrivateKeys: z.array(
    z.object({
      healthDepartmentId: z.uuid(),
      data: z.base64({ rawLength: 32 }),
      iv: z.iv(),
      mac: z.mac(),
      publicKey: z.ecPublicKey(),
      signature: z.ecSignature(),
    })
  ),
});

module.exports = {
  keyIdParametersSchema,
  rotateSchema,
  rekeySchema,
};
