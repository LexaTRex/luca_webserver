module.exports = (Sequelize, DataTypes) => {
  const DummyTrace = Sequelize.define('DummyTrace', {
    traceId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
    healthDepartmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  DummyTrace.associate = models => {
    DummyTrace.belongsTo(models.HealthDepartment, {
      foreignKey: 'healthDepartmentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return DummyTrace;
};
