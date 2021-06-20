module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn(
        'HealthDepartmentEmployees',
        'email',
        {
          unique: true,
          allowNull: false,
          type: DataTypes.STRING,
        },
        { transaction }
      );
      await queryInterface.removeColumn(
        'HealthDepartmentEmployees',
        'username',
        {
          transaction,
        }
      );
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn(
        'HealthDepartmentEmployees',
        'email',
        {
          unique: false,
          allowNull: false,
          type: DataTypes.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'HealthDepartmentEmployees',
        'username',
        {
          unique: true,
          allowNull: true,
          type: DataTypes.STRING,
        },
        { transaction }
      );
      await queryInterface.sequelize.query(
        'UPDATE "HealthDepartmentEmployees" SET "username" = "email";',
        { transaction }
      );
      await queryInterface.changeColumn(
        'HealthDepartmentEmployees',
        'username',
        {
          unique: true,
          allowNull: false,
          type: DataTypes.STRING,
        },
        { transaction }
      );
    });
  },
};
