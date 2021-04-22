module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('DummyTraces', {
      traceId: {
        type: DataTypes.STRING(24),
        allowNull: false,
        primaryKey: true,
      },
      healthDepartmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'HealthDepartments',
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('DummyTraces');
  },
};
