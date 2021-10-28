import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface Attributes {
  uuid: string;
  operatorId: string;
  email: string;
  closed: boolean;
}

interface CreationAttributes {
  operatorId: string;
  email: string;
}

export interface PasswordResetInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initPasswordReset = (
  sequelize: Sequelize
): ModelCtor<PasswordResetInstance> => {
  return sequelize.define<PasswordResetInstance>('PasswordReset', {
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
      allowNull: false,
    },
    closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
