module.exports = (Sequelize, DataTypes) => {
  const Trace = Sequelize.define('Trace', {
    traceId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    time: {
      type: DataTypes.RANGE(DataTypes.DATE),
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    iv: {
      type: DataTypes.STRING(24),
    },
    mac: {
      type: DataTypes.STRING(44),
    },
    publicKey: {
      type: DataTypes.STRING(88),
      allowNull: false,
    },
    deviceType: {
      type: DataTypes.INTEGER,
    },
  });

  Trace.associate = models => {
    Trace.hasOne(models.TraceData, {
      foreignKey: 'traceId',
      onDelete: 'CASCADE',
    });

    Trace.belongsTo(models.Location, {
      foreignKey: 'locationId',
    });
  };

  return Trace;
};
