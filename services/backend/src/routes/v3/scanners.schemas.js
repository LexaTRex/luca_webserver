const { z } = require('../../utils/validation');

const scannerIdParametersSchema = z.object({
  scannerId: z.uuid(),
});

const scannerAccessIdParametersSchema = z.object({
  scannerAccessId: z.uuid(),
});

module.exports = {
  scannerIdParametersSchema,
  scannerAccessIdParametersSchema,
};
