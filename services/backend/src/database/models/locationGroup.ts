import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import type { LocationInstance } from './location';
import type { OperatorInstance } from './operator';
import type { Models } from '..';

interface Attributes {
  uuid: string;
  operatorId: string;
  name?: string;
  type?: string;
}

interface CreationAttributes {
  operatorId: string;
  name?: string;
  type?: string;
}

export interface LocationGroupInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  BaseLocation?: LocationInstance;
  Locations?: Array<LocationInstance>;
  Operator?: OperatorInstance;
}

export const initLocationGroups = (
  sequelize: Sequelize
): ModelCtor<LocationGroupInstance> => {
  return sequelize.define<LocationGroupInstance>(
    'LocationGroup',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      operatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
};

export const associateLocationGroup = (models: Models): void => {
  models.LocationGroup.belongsTo(models.Operator, {
    foreignKey: 'operatorId',
    onDelete: 'CASCADE',
  });

  models.LocationGroup.hasMany(models.Location, {
    foreignKey: 'groupId',
  });

  models.LocationGroup.hasOne(models.Location, {
    foreignKey: 'groupId',
    as: 'BaseLocation',
  });
};
