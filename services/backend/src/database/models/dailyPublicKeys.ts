import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';

interface Attributes {
  keyId: number;
  publicKey: string;
  issuerId: string;
  signature: string;
}

type CreationAttributes = Attributes;

export interface DailyPublicKeyInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initDailyPublicKeys = (
  sequelize: Sequelize
): ModelCtor<DailyPublicKeyInstance> => {
  return sequelize.define<DailyPublicKeyInstance>('DailyPublicKey', {
    keyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      defaultValue: 0,
    },
    publicKey: {
      type: DataTypes.STRING(88),
      allowNull: false,
    },
    issuerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
