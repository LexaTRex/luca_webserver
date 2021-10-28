import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';

interface Attributes {
  uuid: string;
  iv: string;
  keyId: number;
  publicKey: string;
  tan?: string | null;
  data?: string;
  departmentId?: string;
  mac?: string;
}

interface CreationAttributes {
  iv: string;
  keyId: number;
  publicKey: string;
  tan?: string | null;
  data?: string;
  departmentId?: string;
  mac?: string;
}

export interface UserTransferInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initUserTransfers = (
  sequelize: Sequelize
): ModelCtor<UserTransferInstance> => {
  return sequelize.define<UserTransferInstance>('UserTransfer', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    departmentId: {
      type: DataTypes.UUID,
    },
    tan: {
      type: DataTypes.STRING(12),
    },
    data: {
      type: DataTypes.STRING(2048),
    },
    iv: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    mac: {
      type: DataTypes.STRING(44),
    },
    publicKey: {
      type: DataTypes.STRING(88),
      allowNull: false,
    },
    keyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
