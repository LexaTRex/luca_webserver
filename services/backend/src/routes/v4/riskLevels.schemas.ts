import { z } from 'utils/validation';

export const addRiskLevelSchema = z.object({
  locationTransferId: z.uuid(),
});

export const getRiskLevelParameterSchema = z.object({
  locationTransferId: z.uuid(),
});

export const addRiskLevelTracesSchema = z.object({
  locationTransferId: z.uuid(),
  traceIds: z.array(z.traceId()),
});
