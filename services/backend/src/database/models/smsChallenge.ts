import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import config from 'config';
import moment from 'moment';

interface Attributes {
  uuid: string;
  verified: boolean;
  isExpired: boolean;
  tan?: string;
  messageId?: string;
  provider?: string;
}

interface CreationAttributes {
  tan: string;
  messageId: string;
  provider: string;
}

export interface SmsChallengeInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initSMSCHallenge = (
  sequelize: Sequelize
): ModelCtor<SmsChallengeInstance> => {
  return sequelize.define<SmsChallengeInstance>('SMSChallenge', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    tan: {
      type: DataTypes.STRING,
    },
    messageId: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: 'mm',
    },
    isExpired: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment().isAfter(
          moment(this.createdAt).add(config.get('sms.expiry'), 'hour')
        );
      },
    },
  });
};
