import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import type { HealthDepartmentInstance } from './healthDepartment';
import type { LocationInstance } from './location';
import type { LocationTransferTraceInstance } from './locationTransferTrace';
import type { TracingProcessInstance } from './tracingProcess';
import type { Models } from '..';

interface TimerangeDate extends Date {
  value?: string;
  inclusive?: boolean;
}

interface Attributes {
  uuid: string;
  departmentId: string;
  tracingProcessId: string;
  locationId: string;
  time: [TimerangeDate, TimerangeDate];
  isCompleted: boolean;
  contactedAt?: Date;
  signedLocationTransfer?: string;
  approvedAt?: Date;
}

interface CreationAttributes {
  departmentId: string;
  tracingProcessId: string;
  locationId: string;
  time: [TimerangeDate, TimerangeDate];
  signedLocationTransfer?: string;
}

export interface LocationTransferInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  Location?: LocationInstance;
  HealthDepartment?: HealthDepartmentInstance;
  TracingProcess?: TracingProcessInstance;
  LocationTransferTraces?: Array<LocationTransferTraceInstance>;
}

export const initLocationTransfers = (
  sequelize: Sequelize
): ModelCtor<LocationTransferInstance> => {
  return sequelize.define<LocationTransferInstance>(
    'LocationTransfer',
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
      tracingProcessId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      time: {
        type: DataTypes.RANGE(DataTypes.DATE),
        allowNull: false,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      contactedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      signedLocationTransfer: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        defaultValue: null,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      paranoid: true,
    }
  );
};

export const associateLocationTransfer = (models: Models): void => {
  models.LocationTransfer.belongsTo(models.Location, {
    foreignKey: 'locationId',
    onDelete: 'CASCADE',
  });

  models.LocationTransfer.belongsTo(models.TracingProcess, {
    foreignKey: 'tracingProcessId',
    onDelete: 'CASCADE',
  });

  models.LocationTransfer.hasMany(models.LocationTransferTrace, {
    foreignKey: 'locationTransferId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  models.LocationTransfer.belongsTo(models.HealthDepartment, {
    foreignKey: 'departmentId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};
