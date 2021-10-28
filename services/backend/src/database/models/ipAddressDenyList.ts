import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  ipStart: number;
  ipEnd: number;
}

type CreationAttributes = Attributes;

export interface IPAddressDenyListInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {}

export const initIPAddressDenyLists = (
  sequelize: Sequelize
): ModelCtor<IPAddressDenyListInstance> => {
  return sequelize.define<IPAddressDenyListInstance>(
    'IPAddressDenyList',
    {
      ipStart: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      ipEnd: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: 'IPAddressDenyList',
      timestamps: false,
    }
  );
};
