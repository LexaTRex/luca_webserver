import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';

interface Attributes {
  uuid: string;
  startIp: number;
  endIp: number;
  createdAt: Date;
}

type CreationAttributes = {
  startIp: number;
  endIp: number;
};

export interface IpAddressBlockListInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initIPAddressBlockList = (
  sequelize: Sequelize
): ModelCtor<IpAddressBlockListInstance> => {
  return sequelize.define<IpAddressBlockListInstance>(
    'IPAddressBlockList',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      startIp: {
        type: DataTypes.INET,
        allowNull: false,
      },
      endIp: {
        type: DataTypes.INET,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'IPAddressBlockList',
      timestamps: false,
      indexes: [
        {
          fields: ['startIp', 'endIp'],
          unique: true,
          name: 'unique_startip_endip_combo',
        },
      ],
    }
  );
};
