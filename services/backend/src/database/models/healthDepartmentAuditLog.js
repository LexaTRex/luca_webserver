module.exports = (Sequelize, DataTypes) => {
  const HealthDepartmentAuditLog = Sequelize.define(
    'HealthDepartmentAuditLog',
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
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      },
    }
  );

  HealthDepartmentAuditLog.associate = models => {
    HealthDepartmentAuditLog.belongsTo(models.HealthDepartment, {
      foreignKey: 'departmentId',
    });

    HealthDepartmentAuditLog.belongsTo(models.HealthDepartmentEmployee, {
      foreignKey: 'employeeId',
    });
  };

  return HealthDepartmentAuditLog;
};
