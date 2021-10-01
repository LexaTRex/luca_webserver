import {
  ChallengeType,
  OperatorDeviceCreationChallengeState,
} from 'constants/challenges';

export const getChallengeDeviceDTO = (challenge: {
  uuid: string;
  type: ChallengeType;
  state: OperatorDeviceCreationChallengeState;
}) => {
  return {
    uuid: challenge.uuid,
    type: challenge.type,
    state: challenge.state,
  };
};
