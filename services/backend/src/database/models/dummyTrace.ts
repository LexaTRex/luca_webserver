import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';
import type { HealthDepartmentInstance } from './healthDepartment';
import type { Models } from '..';

interface Attributes {
  traceId: string;
  healthDepartmentId: string;
}

type CreationAttributes = Attributes;

export interface DummyTraceInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  HealthDepartment?: HealthDepartmentInstance;
}

export const initDummyTraces = (
  sequelize: Sequelize
): ModelCtor<DummyTraceInstance> => {
  return sequelize.define<DummyTraceInstance>('DummyTrace', {
    traceId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
    healthDepartmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });
};

export const associateDummyTrace = (models: Models): void => {
  models.DummyTrace.belongsTo(models.HealthDepartment, {
    foreignKey: 'healthDepartmentId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};
