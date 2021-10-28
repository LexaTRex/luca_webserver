/* eslint-disable import/no-cycle */
import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';
import type { LocationInstance } from './location';
import { Models } from '..';

interface Attributes {
  uuid: string;
  locationId: string;
  key: string;
  label: string;
  type: string;
  isRequired: boolean;
}

interface CreationAttributes {
  locationId: string;
  key: string;
  label: string;
  type: string;
  isRequired: boolean;
}

export interface AdditionalDataInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  Locations?: Array<LocationInstance>;
}

export const initAdditionalDataSchemas = (
  sequelize: Sequelize
): ModelCtor<AdditionalDataInstance> => {
  return sequelize.define<AdditionalDataInstance>('AdditionalDataSchema', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'string',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};

export const associateAdditionalDataSchema = (models: Models): void => {
  models.AdditionalDataSchema.belongsTo(models.Location, {
    onDelete: 'CASCADE',
    foreignKey: 'locationId',
  });
};
