import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';

interface Attributes {
  keyId: number;
  healthDepartmentId: string;
  issuerId: string;
  data: string;
  iv: string;
  mac: string;
  publicKey: string;
  signature: string;
}

type CreationAttributes = Attributes;

export interface EncryptedBadgePrivateKeyInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initEncryptedBadgePrivateKeys = (
  sequelize: Sequelize
): ModelCtor<EncryptedBadgePrivateKeyInstance> => {
  return sequelize.define<EncryptedBadgePrivateKeyInstance>(
    'EncryptedBadgePrivateKey',
    {
      keyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        unique: 'primaryKey',
        primaryKey: true,
      },
      healthDepartmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'primaryKey',
        primaryKey: true,
      },
      issuerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      data: {
        type: DataTypes.STRING(44),
        allowNull: false,
      },
      iv: {
        type: DataTypes.STRING(24),
        allowNull: false,
      },
      mac: {
        type: DataTypes.STRING(44),
        allowNull: false,
      },
      publicKey: {
        type: DataTypes.STRING(88),
        allowNull: false,
      },
      signature: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
    }
  );
};
