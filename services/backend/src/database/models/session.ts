import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  sid: string;
  userId: string;
  expires: Date;
  data: string;
  type: string;
}

type CreationAttributes = Attributes;

export interface SessionInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initSessions = (
  sequelize: Sequelize
): ModelCtor<SessionInstance> => {
  return sequelize.define<SessionInstance>('Session', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID },
    expires: { type: DataTypes.DATE },
    data: { type: DataTypes.TEXT },
    type: { type: DataTypes.STRING(255) },
  });
};
