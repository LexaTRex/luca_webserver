import { z } from 'utils/validation';
import { OperatorDeviceCreationChallengeState } from 'constants/challenges';

export const challengeIdParameterSchema = z.object({
  challengeId: z.uuid(),
});

export const operatorDeviceCreationChallengeSchema = z.object({
  state: z.nativeEnum(OperatorDeviceCreationChallengeState),
});
