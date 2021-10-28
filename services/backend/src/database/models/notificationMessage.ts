import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import type { Models } from '..';

interface Attributes {
  departmentId: string;
  level: number;
  language: string;
  key: string;
  content: string;
}

type CreationAttributes = Attributes;

export interface NotificationMessageInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
}

export const initNotificationMessages = (
  sequelize: Sequelize
): ModelCtor<NotificationMessageInstance> => {
  return sequelize.define<NotificationMessageInstance>('NotificationMessage', {
    departmentId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  });
};

export const associateNotificationMessage = (models: Models): void => {
  models.NotificationMessage.belongsTo(models.HealthDepartment, {
    foreignKey: 'departmentId',
  });
};
