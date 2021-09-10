module.exports = {
  up: async (queryInterface, DataTypes) =>
    queryInterface.addColumn('HealthDepartments', 'notificationsEnabled', {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }),
  down: async queryInterface =>
    queryInterface.removeColumn('HealthDepartments', 'notificationsEnabled'),
};
