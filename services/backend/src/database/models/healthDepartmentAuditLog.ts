import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';
import { AuditLogEvents, AuditStatusType } from 'constants/auditLog';
import type { HealthDepartmentInstance } from './healthDepartment';
import type { Models } from '..';

type Meta = Record<string, string | number | Array<string | number>>;

interface Attributes {
  uuid: string;
  departmentId: string;
  employeeId: string;
  type: AuditLogEvents;
  status: AuditStatusType;
  meta?: Meta;
}

interface CreationAttributes {
  departmentId: string;
  employeeId: string;
  type: AuditLogEvents;
  status: AuditStatusType;
  meta?: Meta;
}

export interface HealthDepartmentAuditLogInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  HealthDepartment?: HealthDepartmentInstance;
  HealthDepartmentEmployee?: HealthDepartmentInstance;
}

export const initHealthDepartmentAuditLogs = (
  sequelize: Sequelize
): ModelCtor<HealthDepartmentAuditLogInstance> => {
  return sequelize.define<HealthDepartmentAuditLogInstance>(
    'HealthDepartmentAuditLog',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      },
    }
  );
};

export const associateHealthDepartmentAuditLog = (models: Models): void => {
  models.HealthDepartmentAuditLog.belongsTo(models.HealthDepartment, {
    foreignKey: 'departmentId',
  });

  models.HealthDepartmentAuditLog.belongsTo(models.HealthDepartmentEmployee, {
    foreignKey: 'employeeId',
  });
};
