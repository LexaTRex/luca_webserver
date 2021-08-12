import { z } from 'utils/validation';

export const checkinSchema = z.object({
  traceId: z.traceId(),
  scannerId: z.uuid(),
  timestamp: z.unixTimestamp(),
  data: z.base64({ max: 128 }),
  iv: z.iv(),
  mac: z.mac(),
  publicKey: z.ecPublicKey(),
  deviceType: z.deviceType(),
});

export const checkoutSchema = z.object({
  traceId: z.traceId(),
  timestamp: z.number().int().positive(),
});
