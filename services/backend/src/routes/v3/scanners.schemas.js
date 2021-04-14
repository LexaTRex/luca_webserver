const { z } = require('../../middlewares/validateSchema');

const scannerIdParametersSchema = z.object({
  scannerId: z.string().uuid(),
});

const scannerAccessIdParametersSchema = z.object({
  scannerAccessId: z.string().uuid(),
});

module.exports = {
  scannerIdParametersSchema,
  scannerAccessIdParametersSchema,
};
