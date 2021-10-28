import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  chunk: string | Buffer;
  hash: string;
}

type CreationAttributes = Attributes;

export interface NotificationChunkInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initNotificationChunks = (
  sequelize: Sequelize
): ModelCtor<NotificationChunkInstance> => {
  return sequelize.define<NotificationChunkInstance>('NotificationChunk', {
    chunk: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
  });
};
