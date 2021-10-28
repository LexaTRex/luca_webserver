import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';
import type { DummyTraceInstance } from './dummyTrace';
import type { HealthDepartmentAuditLogInstance } from './healthDepartmentAuditLog';
import type { HealthDepartmentEmployeeInstance } from './healthDepartmentEmployee';
import type { LocationTransferInstance } from './locationTransfer';
import type { Models } from '..';

interface Attributes {
  uuid: string;
  name: string;
  privateKeySecret: string;
  notificationsEnabled: boolean;
  email?: string;
  phone?: string;
  publicHDEKP?: string;
  publicHDSKP?: string;
  commonName?: string;
  publicCertificate?: string;
  signedPublicHDEKP?: string;
  signedPublicHDSKP?: string;
}

interface CreationAttributes {
  name: string;
  privateKeySecret: string;
  notificationsEnabled: boolean;
  email?: string;
  phone?: string;
  publicHDEKP?: string;
  publicHDSKP?: string;
  commonName?: string;
  publicCertificate?: string;
  signedPublicHDEKP?: string;
  signedPublicHDSKP?: string;
}

export interface HealthDepartmentInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  DummyTraces?: Array<DummyTraceInstance>;
  LocationTransfers?: Array<LocationTransferInstance>;
  HealthDepartmentEmployees?: Array<HealthDepartmentEmployeeInstance>;
  HealthDepartmentAuditLogs?: Array<HealthDepartmentAuditLogInstance>;
}

export const initHealthDepartments = (
  sequelize: Sequelize
): ModelCtor<HealthDepartmentInstance> => {
  return sequelize.define<HealthDepartmentInstance>(
    'HealthDepartment',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      privateKeySecret: {
        type: DataTypes.STRING(44),
        allowNull: false,
        defaultValue: null,
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publicHDEKP: {
        type: DataTypes.STRING(88),
      },
      publicHDSKP: {
        type: DataTypes.STRING(88),
      },
      commonName: {
        type: DataTypes.STRING(255),
      },
      publicCertificate: {
        type: DataTypes.STRING(8192),
      },
      signedPublicHDEKP: {
        type: DataTypes.STRING(2048),
      },
      signedPublicHDSKP: {
        type: DataTypes.STRING(2048),
      },
      notificationsEnabled: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      paranoid: true,
    }
  );
};

export const associateHealthDepartment = (models: Models): void => {
  models.HealthDepartment.hasMany(models.LocationTransfer, {
    foreignKey: 'departmentId',
  });

  models.HealthDepartment.hasMany(models.DummyTrace, {
    foreignKey: 'healthDepartmentId',
  });

  models.HealthDepartment.hasMany(models.HealthDepartmentEmployee, {
    foreignKey: 'departmentId',
  });

  models.HealthDepartment.hasMany(models.HealthDepartmentAuditLog, {
    foreignKey: 'departmentId',
  });

  models.HealthDepartment.hasMany(models.NotificationMessage, {
    foreignKey: 'departmentId',
  });
};
