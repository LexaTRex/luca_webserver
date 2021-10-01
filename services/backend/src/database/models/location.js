const { Op, fn, col } = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
  const Location = Sequelize.define(
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

  Location.associate = models => {
    Location.belongsTo(models.Operator, {
      foreignKey: 'operator',
      onDelete: 'CASCADE',
    });

    Location.belongsTo(models.LocationGroup, {
      foreignKey: 'groupId',
      onDelete: 'CASCADE',
    });

    Location.hasMany(models.AdditionalDataSchema, {
      foreignKey: 'locationId',
    });

    Location.hasMany(models.Trace, {
      foreignKey: 'locationId',
    });

    Location.hasMany(models.LocationTransfer, {
      foreignKey: 'locationId',
    });
  };

  Location.checkoutAllTraces = ({ location, transaction }) => {
    return Sequelize.models.Trace.update(
      { time: fn('tstzrange', fn('lower', col('time')), fn('now')) },
      {
        where: {
          locationId: location.uuid,
          time: {
            [Op.contains]: fn('now'),
          },
        },
      },
      { transaction }
    );
  };

  return Location;
};
