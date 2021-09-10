module.exports = (Sequelize, DataTypes) => {
  const RiskLevel = Sequelize.define('RiskLevel', {
    locationTransferTraceId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  });

  RiskLevel.associate = models => {
    RiskLevel.belongsTo(models.LocationTransferTrace, {
      foreignKey: 'locationTransferTraceId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return RiskLevel;
};
