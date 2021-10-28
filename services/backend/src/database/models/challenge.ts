import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';
import {
  ChallengeType,
  OperatorDeviceCreationChallengeState,
} from 'constants/challenges';

interface Attributes {
  uuid: string;
  type: ChallengeType;
  state: OperatorDeviceCreationChallengeState;
}

type CreationAttributes = {
  type: ChallengeType;
  state: OperatorDeviceCreationChallengeState;
};

export interface ChallengeInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initChallenges = (
  sequelize: Sequelize
): ModelCtor<ChallengeInstance> => {
  return sequelize.define<ChallengeInstance>('Challenge', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING(32),
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING(32),
    },
  });
};
