import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  fingerprint: string;
  name: string;
  publicKey: string;
}

type CreationAttributes = Attributes;

export interface TestProviderInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initTestProviders = (
  sequelize: Sequelize
): ModelCtor<TestProviderInstance> => {
  return sequelize.define<TestProviderInstance>('TestProvider', {
    fingerprint: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.STRING(8192),
      allowNull: false,
    },
  });
};
