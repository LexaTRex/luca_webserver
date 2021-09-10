const { z } = require('../../utils/validation');

const storeKeysSchema = z.object({
  publicCertificate: z.string(),
  signedPublicHDEKP: z.string(),
  signedPublicHDSKP: z.string(),
});

module.exports = {
  storeKeysSchema,
};
