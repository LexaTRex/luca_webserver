import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  uuid: string;
  data: string;
  publicKey?: string;
  iv?: string;
  mac?: string;
  signature?: string;
  deviceType?: number;
}

type CreationAttributes = Attributes;

export interface UserInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const initUsers = (sequelize: Sequelize): ModelCtor<UserInstance> => {
  return sequelize.define<UserInstance>(
    'User',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      publicKey: {
        type: DataTypes.STRING(88),
      },
      data: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      iv: {
        type: DataTypes.STRING,
      },
      mac: {
        type: DataTypes.STRING,
      },
      signature: {
        type: DataTypes.STRING,
      },
      deviceType: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
};
