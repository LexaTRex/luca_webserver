module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('TracingProcesses', 'assigneeId', {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
      references: {
        model: 'HealthDepartmentEmployees',
        key: 'uuid',
      },
    });
  },
  down: async queryInterface => {
    return queryInterface.removeColumn('TracingProcesses', 'assigneeId');
  },
};
