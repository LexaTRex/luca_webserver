import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import { LocationTransferInstance } from './locationTransfer';
import { RiskLevelInstance } from './riskLevel';
import { TraceInstance } from './trace';
import type { Models } from '..';

interface TimerangeDate extends Date {
  value?: string;
  inclusive?: boolean;
}

interface Attributes {
  uuid: string;
  locationTransferId: string;
  traceId: string;
  time: [TimerangeDate, TimerangeDate] | [TimerangeDate, null];
  isHDEncrypted?: boolean;
  data?: string;
  dataPublicKey?: string;
  dataMAC?: string;
  dataIV?: string;
  publicKey?: string;
  keyId?: string;
  version?: number;
  verification?: string;
  deviceType?: number;
  additionalData?: string;
  additionalDataPublicKey?: string;
  additionalDataMAC?: string;
  additionalDataIV?: string;
}

interface CreationAttributes {
  locationTransferId: string;
  traceId: string;
  time: [TimerangeDate, TimerangeDate] | [TimerangeDate, null];
  deviceType?: number;
}

export interface LocationTransferTraceInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  LocationTransfer?: LocationTransferInstance;
  Trace?: TraceInstance;
  RiskLevels?: Array<RiskLevelInstance>;
}

export const initLocationTransferTraces = (
  sequelize: Sequelize
): ModelCtor<LocationTransferTraceInstance> => {
  return sequelize.define<LocationTransferTraceInstance>(
    'LocationTransferTrace',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      locationTransferId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      traceId: {
        type: DataTypes.STRING(24),
        allowNull: false,
      },
      time: {
        type: DataTypes.RANGE(DataTypes.DATE),
        allowNull: false,
      },
      isHDEncrypted: {
        type: DataTypes.BOOLEAN,
      },
      data: {
        type: DataTypes.STRING(44),
      },
      dataPublicKey: {
        type: DataTypes.STRING(88),
      },
      dataMAC: {
        type: DataTypes.STRING(44),
      },
      dataIV: {
        type: DataTypes.STRING(24),
      },
      publicKey: {
        type: DataTypes.STRING(88),
      },
      keyId: {
        type: DataTypes.INTEGER,
      },
      version: {
        type: DataTypes.INTEGER,
      },
      verification: {
        type: DataTypes.STRING(12),
      },
      deviceType: {
        type: DataTypes.INTEGER,
      },
      additionalData: {
        type: DataTypes.STRING(1024),
      },
      additionalDataPublicKey: {
        type: DataTypes.STRING(88),
      },
      additionalDataMAC: {
        type: DataTypes.STRING(44),
      },
      additionalDataIV: {
        type: DataTypes.STRING(24),
      },
    }
  );
};

export const associateLocationTransferTrace = (models: Models): void => {
  models.LocationTransferTrace.belongsTo(models.LocationTransfer, {
    foreignKey: 'locationTransferId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  models.LocationTransferTrace.hasOne(models.Trace, {
    sourceKey: 'traceId',
    foreignKey: 'traceId',
  });

  models.LocationTransferTrace.hasMany(models.RiskLevel, {
    foreignKey: 'locationTransferTraceId',
  });
};
