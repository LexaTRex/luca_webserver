import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';

interface Attributes {
  hash: string;
  tag: string;
}

type CreationAttributes = Attributes;

export interface TestRedeemInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initTestRedeems = (
  sequelize: Sequelize
): ModelCtor<TestRedeemInstance> => {
  return sequelize.define<TestRedeemInstance>('TestRedeem', {
    hash: {
      type: DataTypes.STRING(44),
      allowNull: false,
      primaryKey: true,
    },
    tag: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
  });
};
