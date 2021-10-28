import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import type { TraceInstance } from './trace';
import type { Models } from '..';

interface Attributes {
  traceId: string;
  data: string;
  iv?: string;
  mac?: string;
  publicKey?: string;
}

interface CreationAttributes {
  traceId: string;
  data: string;
  iv: string;
  mac: string;
  publicKey: string;
}

export interface TraceDataInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;

  Trace?: TraceInstance;
}

export const initTraceData = (
  sequelize: Sequelize
): ModelCtor<TraceDataInstance> => {
  return sequelize.define<TraceDataInstance>('TraceData', {
    traceId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
    data: {
      type: DataTypes.STRING(4096),
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
  });
};

export const associateTraceDatum = (models: Models): void => {
  models.TraceData.belongsTo(models.Trace, {
    foreignKey: 'traceId',
    onDelete: 'CASCADE',
  });
};
