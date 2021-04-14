module.exports = (Sequelize, DataTypes) => {
  const LocationTransferGroup = Sequelize.define('LocationTransferGroup', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
  });

  LocationTransferGroup.associate = models => {
    LocationTransferGroup.belongsToMany(models.LocationTransfer, {
      through: 'LocationTransferGroupMappings',
      foreignKey: 'groupId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    LocationTransferGroup.belongsTo(models.TracingProcess, {
      foreignKey: 'tracingProcessId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return LocationTransferGroup;
};
