import { z } from 'utils/validation';
import { RiskLevel } from 'constants/riskLevels';

export const getRiskLevelParameterSchema = z.object({
  locationTransferId: z.uuid(),
});

export const addRiskLevelTracesSchema = z.object({
  locationTransferId: z.uuid(),
  traceIds: z.array(z.traceId()),
  riskLevel: z.nativeEnum(RiskLevel),
});
