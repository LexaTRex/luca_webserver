import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import type { LocationInstance } from './location';
import type { TraceDataInstance } from './traceData';
import type { Models } from '..';

interface TimerangeDate extends Date {
  value?: string;
  inclusive?: boolean;
}

interface Attributes {
  traceId: string;
  locationId: string;
  time: [TimerangeDate, TimerangeDate] | [TimerangeDate, null];
  data: string;
  publicKey: string;
  iv?: string;
  mac?: string;
  deviceType?: number;
}

type CreationAttributes = Attributes;

export interface TraceInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;

  Location?: LocationInstance;
  TraceDatum?: TraceDataInstance;
}

export const initTraces = (sequelize: Sequelize): ModelCtor<TraceInstance> => {
  return sequelize.define<TraceInstance>('Trace', {
    traceId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    time: {
      type: DataTypes.RANGE(DataTypes.DATE),
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    iv: {
      type: DataTypes.STRING(24),
    },
    mac: {
      type: DataTypes.STRING(44),
    },
    publicKey: {
      type: DataTypes.STRING(88),
      allowNull: false,
    },
    deviceType: {
      type: DataTypes.INTEGER,
    },
  });
};

export const associateTrace = (models: Models): void => {
  models.Trace.hasOne(models.TraceData, {
    foreignKey: 'traceId',
    onDelete: 'CASCADE',
  });

  models.Trace.belongsTo(models.Location, {
    foreignKey: 'locationId',
  });
};
