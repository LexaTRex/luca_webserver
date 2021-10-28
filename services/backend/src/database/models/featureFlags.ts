import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';

interface Attributes {
  key: string;
  value: string;
  locationFrontend: boolean;
  healthDepartmentFrontend: boolean;
  webapp: boolean;
  ios: boolean;
  android: boolean;
  operatorApp: boolean;
}

type CreationAttributes = Attributes;

export interface FeatureFlagInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initFeatureFlags = (
  sequelize: Sequelize
): ModelCtor<FeatureFlagInstance> => {
  return sequelize.define<FeatureFlagInstance>('FeatureFlag', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
    },
    locationFrontend: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    healthDepartmentFrontend: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    webapp: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    ios: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    android: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    operatorApp: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
  });
};
