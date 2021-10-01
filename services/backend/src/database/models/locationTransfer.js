module.exports = (Sequelize, DataTypes) => {
  const LocationTransfer = Sequelize.define(
    'LocationTransfer',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      tracingProcessId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      time: {
        type: DataTypes.RANGE(DataTypes.DATE),
        allowNull: false,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      contactedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      signedLocationTransfer: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        defaultValue: null,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      paranoid: true,
    }
  );

  LocationTransfer.associate = models => {
    LocationTransfer.belongsTo(models.Location, {
      foreignKey: 'locationId',
      onDelete: 'CASCADE',
    });

    LocationTransfer.belongsTo(models.HealthDepartment, {
      foreignKey: 'departmentId',
      onDelete: 'CASCADE',
    });

    LocationTransfer.belongsTo(models.TracingProcess, {
      foreignKey: 'tracingProcessId',
      onDelete: 'CASCADE',
    });

    LocationTransfer.hasMany(models.LocationTransferTrace, {
      foreignKey: 'locationTransferId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    LocationTransfer.belongsTo(models.HealthDepartment, {
      foreignKey: 'departmentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return LocationTransfer;
};
