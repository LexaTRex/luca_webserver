module.exports = (Sequelize, DataTypes) => {
  const TraceData = Sequelize.define('TraceData', {
    traceId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
    data: {
      type: DataTypes.STRING(4096),
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
  });

  TraceData.associate = models => {
    TraceData.belongsTo(models.Trace, {
      foreignKey: 'traceId',
      onDelete: 'CASCADE',
    });
  };

  return TraceData;
};
