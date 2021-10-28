import {
  Sequelize,
  Model,
  DataTypes,
  ModelCtor,
  Op,
  fn,
  col,
  Transaction,
} from 'sequelize';
import type { AdditionalDataInstance } from './additionalDataSchema';
import type { LocationGroupInstance } from './locationGroup';
import type { LocationTransferInstance } from './locationTransfer';
import type { OperatorInstance } from './operator';
import type { TraceInstance } from './trace';
import type { Models } from '..';

interface Attributes {
  uuid: string;
  radius: number;
  scannerId: string;
  shouldProvideGeoLocation: boolean;
  isPrivate: boolean;
  publicKey: string;
  accessId: string;
  scannerAccessId: string;
  formId: string;
  isIndoor: boolean;
  groupid?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  streetName?: string;
  streetNr?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  operator?: string;
  endsAt?: Date;
  tableCount?: number;
  type?: string;
  averageCheckinTime?: number;
}

type CreationAttributes = Attributes;

export interface LocationInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  checkoutAllTraces: (payload: {
    location: LocationInstance;
    transaction: Transaction;
  }) => Promise<void>;

  AdditionalDataSchemas?: Array<AdditionalDataInstance>;
  Operator?: OperatorInstance;
  LocationGroup?: LocationGroupInstance;
  Traces?: Array<TraceInstance>;
  LocationTransfers?: Array<LocationTransferInstance>;
}

export const initLocations = (
  sequelize: Sequelize
): ModelCtor<LocationInstance> => {
  const model = sequelize.define<LocationInstance>(
    'Location',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      scannerId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      accessId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      formId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      scannerAccessId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      streetName: {
        type: DataTypes.STRING,
      },
      streetNr: {
        type: DataTypes.STRING,
      },
      zipCode: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      lat: {
        type: DataTypes.DOUBLE,
        defaultValue: null,
      },
      lng: {
        type: DataTypes.DOUBLE,
        defaultValue: null,
      },
      radius: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      endsAt: {
        type: DataTypes.DATE,
      },
      tableCount: {
        type: DataTypes.INTEGER,
      },
      shouldProvideGeoLocation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      publicKey: {
        type: DataTypes.STRING(88),
      },
      isIndoor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'other',
      },
      averageCheckinTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      paranoid: true,
    }
  );

  model.prototype.checkoutAllTraces = async function (
    transaction?: Transaction
  ) {
    return sequelize.models.Trace.update(
      { time: fn('tstzrange', fn('lower', col('time')), fn('now')) },
      {
        where: {
          locationId: this.get('uuid'),
          // @ts-ignore not typable
          time: {
            [Op.contains]: fn('now'),
          },
        },
        transaction,
      }
    );
  };

  return model;
};

export const associateLocation = (models: Models): void => {
  models.Location.belongsTo(models.Operator, {
    foreignKey: 'operator',
    onDelete: 'CASCADE',
  });

  models.Location.belongsTo(models.LocationGroup, {
    foreignKey: 'groupId',
    onDelete: 'CASCADE',
  });

  models.Location.hasMany(models.AdditionalDataSchema, {
    foreignKey: 'locationId',
  });

  models.Location.hasMany(models.Trace, {
    foreignKey: 'locationId',
  });

  models.Location.hasMany(models.LocationTransfer, {
    foreignKey: 'locationId',
  });
};
