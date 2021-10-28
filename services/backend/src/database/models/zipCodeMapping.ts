import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';

interface Attributes {
  zipCode: string;
  city: string;
  state: string;
  community: string;
}

type CreationAttributes = Attributes;

export interface ZipCodeMappingInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {}

export const initZipCodeMapping = (
  sequelize: Sequelize
): ModelCtor<ZipCodeMappingInstance> => {
  return sequelize.define<ZipCodeMappingInstance>(
    'ZipCodeMapping',
    {
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      community: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
