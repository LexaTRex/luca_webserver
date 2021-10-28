import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  ip: string;
  comment?: string;
  rateLimitFactor?: number;
}

type CreationAttributes = Attributes;

export interface IPAddressAllowListInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {}

export const initIPAddressAllowLists = (
  sequelize: Sequelize
): ModelCtor<IPAddressAllowListInstance> => {
  return sequelize.define<IPAddressAllowListInstance>(
    'IPAddressAllowList',
    {
      ip: {
        type: DataTypes.INET,
        allowNull: false,
        primaryKey: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rateLimitFactor: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'IPAddressAllowList',
      timestamps: false,
    }
  );
};
