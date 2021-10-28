module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn(
        'HealthDepartmentAuditLogs',
        'employeeId',
        {
          type: DataTypes.UUID,
          allowNull: true,
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn(
        'HealthDepartmentAuditLogs',
        'employeeId',
        {
          type: DataTypes.UUID,
          allowNull: false,
        },
        { transaction }
      );
    });
  },
};
