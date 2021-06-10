module.exports = (Sequelize, DataTypes) => {
  const TracingProcess = Sequelize.define('TracingProcess', {
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
    userTransferId: {
      type: DataTypes.UUID,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
  });

  TracingProcess.associate = models => {
    TracingProcess.belongsTo(models.HealthDepartmentEmployee, {
      foreignKey: 'assigneeId',
    });

    TracingProcess.hasMany(models.LocationTransfer, {
      foreignKey: 'tracingProcessId',
    });

    TracingProcess.hasMany(models.LocationTransferGroup, {
      foreignKey: 'tracingProcessId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return TracingProcess;
};
