module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('HealthDepartments', 'email', {
      allowNull: true,
      type: DataTypes.CITEXT,
    });
    await queryInterface.addColumn('HealthDepartments', 'phone', {
      allowNull: true,
      type: DataTypes.STRING,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('HealthDepartments', 'email');
    await queryInterface.removeColumn('HealthDepartments', 'phone');
  },
};
