import { promisify } from 'util';
import crypto from 'crypto';
import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';
import { UserType } from 'constants/user';
import type { HealthDepartmentInstance } from './healthDepartment';
import type { HealthDepartmentAuditLogInstance } from './healthDepartmentAuditLog';
import type { TracingProcessInstance } from './tracingProcess';
import type { Models } from '..';

interface Attributes {
  uuid: string;
  email: string;
  departmentId: string;
  password: string;
  salt: string;
  isAdmin: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface CreationAttributes {
  email: string;
  departmentId: string;
  password: string;
  salt: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface HealthDepartmentEmployeeInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  checkPassword: (testPassword: string) => Promise<boolean>;

  HealthDepartment?: HealthDepartmentInstance;
  HealthDepartmentAuditLogs?: Array<HealthDepartmentAuditLogInstance>;
  TracingProcesses?: Array<TracingProcessInstance>;
}

const scrypt = promisify(crypto.scrypt);

const KEY_LENGTH = 64;

const hashPasswordHook = async (instance: HealthDepartmentEmployeeInstance) => {
  if (!instance.changed('password')) return;
  const password = instance.get('password');
  const salt = instance.get('salt');
  const hash = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  await instance.set('password', hash.toString('base64'));
};

const destroySessionsHook = async (
  instance: HealthDepartmentEmployeeInstance
) => {
  if (!instance.changed('password')) return;
  await instance.sequelize.models.Session.destroy({
    where: {
      userId: instance.get('uuid'),
      type: UserType.HEALTH_DEPARTMENT_EMPLOYEE,
    },
  });
};

export const initHealthDepartmentEmployees = (
  sequelize: Sequelize
): ModelCtor<HealthDepartmentEmployeeInstance> => {
  const model = sequelize.define<HealthDepartmentEmployeeInstance>(
    'HealthDepartmentEmployee',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      hooks: {
        beforeCreate: hashPasswordHook,
        beforeUpdate: hashPasswordHook,
        afterUpdate: destroySessionsHook,
      },
    }
  );

  model.prototype.checkPassword = async function checkPassword(
    testPassword: string
  ) {
    const hash = (await scrypt(
      testPassword,
      this.get('salt'),
      KEY_LENGTH
    )) as Buffer;
    return hash.toString('base64') === this.get('password');
  };

  return model;
};

export const associateHealthDepartmentEmployee = (models: Models): void => {
  models.HealthDepartmentEmployee.belongsTo(models.HealthDepartment, {
    foreignKey: 'departmentId',
  });

  models.HealthDepartmentEmployee.hasMany(models.TracingProcess, {
    foreignKey: 'assigneeId',
  });

  models.HealthDepartmentEmployee.hasMany(models.HealthDepartmentAuditLog, {
    foreignKey: 'employeeId',
  });
};
