import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';
import type { Models } from '..';

interface Attributes {
  uuid: string;
  operatorId: string;
  closed: boolean;
  discarded: boolean;
  email?: string;
  type?: string;
}

type CreationAttributes = Attributes;

export interface EmailActivationInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initEmailActivations = (
  sequelize: Sequelize
): ModelCtor<EmailActivationInstance> => {
  return sequelize.define<EmailActivationInstance>('EmailActivation', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    operatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.CITEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discarded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};

export const associateEmailActivation = (models: Models): void => {
  models.EmailActivation.belongsTo(models.Operator, {
    foreignKey: 'operatorId',
    onDelete: 'CASCADE',
  });
};
