import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import type { ZipCodeMappingInstance } from './zipCodeMapping';
import type { Models } from '..';

interface Attributes {
  state: string;
  retentionPeriod: number;
}

interface CreationAttributes {
  state: string;
  retentionPeriod: number;
}

export interface RetentionPolicyInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  ZipCodeMapping: ZipCodeMappingInstance;
}

export const initRetentionPolicy = (
  sequelize: Sequelize
): ModelCtor<RetentionPolicyInstance> => {
  return sequelize.define<RetentionPolicyInstance>(
    'RetentionPolicy',
    {
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      retentionPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

export const associateRetentionPolicy = (models: Models): void => {
  models.RetentionPolicy.hasMany(models.ZipCodeMapping, {
    foreignKey: 'state',
  });
};
