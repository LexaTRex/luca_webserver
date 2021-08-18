module.exports = (Sequelize, DataTypes) => {
  const TracingProcess = Sequelize.define(
    'TracingProcess',
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
      note: {
        type: DataTypes.STRING(1000),
      },
      noteIV: {
        type: DataTypes.STRING(24),
      },
      noteMAC: {
        type: DataTypes.STRING(44),
      },
      noteSignature: {
        type: DataTypes.STRING,
      },
      notePublicKey: {
        type: DataTypes.STRING(88),
      },
    },
    {
      paranoid: true,
    }
  );

  TracingProcess.associate = models => {
    TracingProcess.belongsTo(models.HealthDepartmentEmployee, {
      foreignKey: 'assigneeId',
    });

    TracingProcess.hasMany(models.LocationTransfer, {
      foreignKey: 'tracingProcessId',
      onDelete: 'CASCADE',
    });
  };

  return TracingProcess;
};
