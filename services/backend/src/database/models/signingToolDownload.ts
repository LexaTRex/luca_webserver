import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  version: string;
  downloadUrl: string;
  hash: string;
}

type CreationAttributes = Attributes;

export interface SigningToolDownloadInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {}

export const initSigningToolDownload = (
  sequelize: Sequelize
): ModelCtor<SigningToolDownloadInstance> => {
  return sequelize.define<SigningToolDownloadInstance>(
    'SigningToolDownload',
    {
      version: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      downloadUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
