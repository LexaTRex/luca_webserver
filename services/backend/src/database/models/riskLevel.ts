import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import type { LocationTransferTraceInstance } from './locationTransferTrace';
import type { Models } from '..';

interface Attributes {
  locationTransferTraceId: string;
  level: number;
}

type CreationAttributes = Attributes;

export interface RiskLevelInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  LocationTransferTrace?: LocationTransferTraceInstance;
}

export const initRiskLevels = (
  sequelize: Sequelize
): ModelCtor<RiskLevelInstance> => {
  return sequelize.define<RiskLevelInstance>('RiskLevel', {
    locationTransferTraceId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  });
};

export const associateRiskLevel = (models: Models): void => {
  models.RiskLevel.belongsTo(models.LocationTransferTrace, {
    foreignKey: 'locationTransferTraceId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};
