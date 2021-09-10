module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await Promise.all([
        queryInterface.changeColumn(
          'HealthDepartmentEmployees',
          'firstName',
          {
            type: DataTypes.STRING,
            allowNull: true,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'HealthDepartmentEmployees',
          'lastName',
          {
            type: DataTypes.STRING,
            allowNull: true,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'HealthDepartmentEmployees',
          'phone',
          {
            type: DataTypes.STRING,
            allowNull: true,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await Promise.all([
        queryInterface.changeColumn(
          'HealthDepartmentEmployees',
          'firstName',
          {
            type: DataTypes.STRING,
            allowNull: false,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'HealthDepartmentEmployees',
          'lastName',
          {
            type: DataTypes.STRING,
            allowNull: false,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'HealthDepartmentEmployees',
          'phone',
          {
            type: DataTypes.STRING,
            allowNull: false,
          },
          { transaction }
        ),
      ]);
    });
  },
};
