import { z } from 'utils/validation';
import {
  OperatorDevice,
  OperatorDeviceSupportedOSTypes,
} from 'constants/operatorDevice';

export const deviceIdParametersSchema = z.object({
  deviceId: z.uuid(),
});
export const deviceCreationSchema = z.object({
  role: z.nativeEnum(OperatorDevice),
});
export const deviceSchema = z.object({
  os: z.nativeEnum(OperatorDeviceSupportedOSTypes).optional(),
  name: z.safeString().max(64).min(3).optional(),
});
export const deviceActivationSchema = z.object({
  os: z.nativeEnum(OperatorDeviceSupportedOSTypes),
  refreshToken: z.string().max(255),
  name: z.safeString().max(64).min(3),
});
