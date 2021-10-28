import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  zip: string;
}

type CreationAttributes = Attributes;

export interface SupportedZipCodesInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initSupportedZipCodes = (
  sequelize: Sequelize
): ModelCtor<SupportedZipCodesInstance> => {
  return sequelize.define<SupportedZipCodesInstance>('SupportedZipCode', {
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  });
};
