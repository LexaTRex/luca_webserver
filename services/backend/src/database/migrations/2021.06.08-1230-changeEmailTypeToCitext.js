module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        `CREATE EXTENSION IF NOT EXISTS citext;`,
        { transaction }
      );

      await Promise.all([
        await queryInterface.changeColumn(
          'HealthDepartmentEmployees',
          'email',
          {
            unique: true,
            allowNull: false,
            type: DataTypes.CITEXT,
          },
          { transaction }
        ),
        await queryInterface.changeColumn(
          'Operators',
          'email',
          {
            allowNull: false,
            type: DataTypes.CITEXT,
          },
          { transaction }
        ),
        await queryInterface.changeColumn(
          'Operators',
          'username',
          {
            unique: true,
            allowNull: false,
            type: DataTypes.CITEXT,
          },
          { transaction }
        ),
        await queryInterface.changeColumn(
          'PasswordResets',
          'email',
          {
            allowNull: false,
            type: DataTypes.CITEXT,
          },
          { transaction }
        ),
        await queryInterface.changeColumn(
          'EmailActivations',
          'email',
          {
            allowNull: true,
            type: DataTypes.CITEXT,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        `DROP EXTENSION IF NOT EXISTS citext;`,
        { transaction }
      );

      await Promise.all([
        await queryInterface.changeColumn(
          'HealthDepartmentEmployees',
          'email',
          {
            unique: true,
            allowNull: false,
            type: DataTypes.STRING,
          },
          { transaction }
        ),
        await queryInterface.changeColumn(
          'Operators',
          'email',
          {
            allowNull: false,
            type: DataTypes.STRING,
          },
          { transaction }
        ),
        await queryInterface.changeColumn(
          'Operators',
          'username',
          {
            unique: true,
            allowNull: false,
            type: DataTypes.STRING,
          },
          { transaction }
        ),
        await queryInterface.changeColumn(
          'PasswordResets',
          'email',
          {
            allowNull: false,
            type: DataTypes.STRING,
          },
          { transaction }
        ),
        await queryInterface.changeColumn(
          'EmailActivations',
          'email',
          {
            allowNull: true,
            type: DataTypes.STRING,
          },
          { transaction }
        ),
      ]);
    });
  },
};
