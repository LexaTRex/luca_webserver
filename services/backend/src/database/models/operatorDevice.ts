import {
  Sequelize,
  Model,
  ModelCtor,
  DataTypes,
  EnumDataType,
} from 'sequelize';
import { OperatorDevice as OperatorDeviceType } from 'constants/operatorDevice';
import type { OperatorInstance } from './operator';
import type { Models } from '..';

interface Attributes {
  uuid: string;
  activated: boolean;
  name: string;
  os: string;
  role: OperatorDeviceType;
  reactivatedAt: Date;
  refreshedAt: Date;
  operatorId?: string;
}

type CreationAttributes = {
  role: OperatorDeviceType;
  operatorId: string;
  refreshedAt: Date;
};

export interface OperatorDeviceInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  Operator?: OperatorInstance;

  createdAt: Date;
  updatedAt: Date;
}

export const initOperatorDevices = (
  sequelize: Sequelize
): ModelCtor<OperatorDeviceInstance> => {
  return sequelize.define<OperatorDeviceInstance>('OperatorDevice', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    activated: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    name: {
      type: DataTypes.STRING(64),
    },
    os: {
      defaultValue: 'unknown',
      type: DataTypes.STRING(8),
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM(([
        OperatorDeviceType.scanner,
        OperatorDeviceType.employee,
        OperatorDeviceType.manager,
      ] as unknown) as EnumDataType<string>),
    },
    reactivatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    refreshedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
};

export const associateOperatorDevice = (models: Models): void => {
  models.OperatorDevice.belongsTo(models.Operator, {
    foreignKey: 'operatorId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};
