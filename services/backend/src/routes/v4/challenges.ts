import { Router } from 'express';

import database from 'database/models';
import {
  validateSchema,
  validateParametersSchema,
} from 'middlewares/validateSchema';
import {
  limitRequestsPerDay,
  limitRequestsPerHour,
} from 'middlewares/rateLimit';
import {
  ChallengeType,
  OperatorDeviceCreationChallengeState,
} from 'constants/challenges';
import { ApiError, ApiErrorType } from 'utils/apiError';
import { requireOperator } from 'middlewares/requireUser';

import {
  operatorDeviceCreationChallengeSchema,
  challengeIdParameterSchema,
} from './challenges.schema';
import { getChallengeDeviceDTO } from './challenges.helper';

const router = Router();

router.post(
  '/operatorDevice',
  requireOperator,
  limitRequestsPerDay('challenges_operatorDevice_post_ratelimit_day'),
  limitRequestsPerHour('challenges_operatorDevice_post_ratelimit_hour'),
  async (request, response) => {
    const challenge = await database.Challenge.create({
      type: ChallengeType.OperatorDeviceCreation,
      state: OperatorDeviceCreationChallengeState.Ready,
    });

    return response.send(getChallengeDeviceDTO(challenge));
  }
);

router.patch(
  '/operatorDevice/:challengeId',
  limitRequestsPerDay('challenges_operatorDevice_patch_ratelimit_day'),
  limitRequestsPerHour('challenges_operatorDevice_patch_ratelimit_hour'),
  validateSchema(operatorDeviceCreationChallengeSchema),
  validateParametersSchema(challengeIdParameterSchema),
  async (request, response) => {
    const challenge = await database.Challenge.findByPk(
      request.params.challengeId
    );

    if (!challenge) {
      throw new ApiError(ApiErrorType.CHALLENGE_NOT_FOUND);
    }

    await challenge.update({ state: request.body.state });
    return response.send(getChallengeDeviceDTO(challenge));
  }
);

router.get(
  '/operatorDevice/:challengeId',
  validateParametersSchema(challengeIdParameterSchema),
  async (request, response) => {
    const challenge = await database.Challenge.findByPk(
      request.params.challengeId
    );

    if (!challenge) {
      throw new ApiError(ApiErrorType.CHALLENGE_NOT_FOUND);
    }

    return response.send(getChallengeDeviceDTO(challenge));
  }
);

export default router;
