module.exports = (Sequelize, DataTypes) => {
  const LocationTransferTrace = Sequelize.define('LocationTransferTrace', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    locationTransferId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    traceId: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    time: {
      type: DataTypes.RANGE(DataTypes.DATE),
      allowNull: false,
    },
    isHDEncrypted: {
      type: DataTypes.BOOLEAN,
    },
    data: {
      type: DataTypes.STRING(44),
    },
    dataPublicKey: {
      type: DataTypes.STRING(88),
    },
    dataMAC: {
      type: DataTypes.STRING(44),
    },
    dataIV: {
      type: DataTypes.STRING(24),
    },
    publicKey: {
      type: DataTypes.STRING(88),
    },
    keyId: {
      type: DataTypes.INTEGER,
    },
    version: {
      type: DataTypes.INTEGER,
    },
    verification: {
      type: DataTypes.STRING(12),
    },
    deviceType: {
      type: DataTypes.INTEGER,
    },
    additionalData: {
      type: DataTypes.STRING(1024),
    },
    additionalDataPublicKey: {
      type: DataTypes.STRING(88),
    },
    additionalDataMAC: {
      type: DataTypes.STRING(44),
    },
    additionalDataIV: {
      type: DataTypes.STRING(24),
    },
  });

  LocationTransferTrace.associate = models => {
    LocationTransferTrace.belongsTo(models.LocationTransfer, {
      foreignKey: 'locationTransferId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    LocationTransferTrace.hasOne(models.Trace, {
      sourceKey: 'traceId',
      foreignKey: 'traceId',
    });
  };

  return LocationTransferTrace;
};
