import config from 'config';
import { z } from 'utils/validation';

export const createSchema = z.object({
  locations: z
    .array(
      z.object({
        time: z.array(z.unixTimestamp()).length(2),
        locationId: z.uuid(),
        signedLocationTransfer: z.string().max(1024),
      })
    )
    .nonempty()
    .max(config.get('luca.locationTransfers.maxLocations')),
  userTransferId: z.uuid().optional(),
  lang: z.supportedLanguage(),
});

export const transferIdParametersSchema = z.object({
  transferId: z.uuid(),
});
