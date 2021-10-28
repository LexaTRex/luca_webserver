import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import type { HealthDepartmentEmployeeInstance } from './healthDepartmentEmployee';
import type { LocationTransferInstance } from './locationTransfer';
import type { Models } from '..';

interface Attributes {
  uuid: string;
  departmentId: string;
  userTransferId?: string;
  isCompleted: boolean;
  assigneeId?: string;
  note?: string;
  noteIV?: string;
  noteMAC?: string;
  noteSignature?: string;
  notePublicKey?: string;
}

interface CreationAttributes {
  departmentId: string;
  userTransferId?: string;
  note?: string;
  noteIV?: string;
  noteMAC?: string;
  noteSignature?: string;
  notePublicKey?: string;
}

export interface TracingProcessInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;

  HealthDepartmentEmployee?: HealthDepartmentEmployeeInstance;
  LocationTransfers?: Array<LocationTransferInstance>;
}

export const initTracingProcesses = (
  sequelize: Sequelize
): ModelCtor<TracingProcessInstance> => {
  return sequelize.define<TracingProcessInstance>(
    'TracingProcess',
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
      userTransferId: {
        type: DataTypes.UUID,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      assigneeId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
      },
      note: {
        type: DataTypes.STRING(1000),
      },
      noteIV: {
        type: DataTypes.STRING(24),
      },
      noteMAC: {
        type: DataTypes.STRING(44),
      },
      noteSignature: {
        type: DataTypes.STRING,
      },
      notePublicKey: {
        type: DataTypes.STRING(88),
      },
    },
    {
      paranoid: true,
    }
  );
};

export const associateTracingProcess = (models: Models): void => {
  models.TracingProcess.belongsTo(models.HealthDepartmentEmployee, {
    foreignKey: 'assigneeId',
  });

  models.TracingProcess.hasMany(models.LocationTransfer, {
    foreignKey: 'tracingProcessId',
    onDelete: 'CASCADE',
  });
};
