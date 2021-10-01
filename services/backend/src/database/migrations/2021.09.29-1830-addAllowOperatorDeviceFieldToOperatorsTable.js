module.exports = {
  up: async (queryInterface, DataTypes) =>
    queryInterface.addColumn('Operators', 'allowOperatorDevices', {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    }),
  down: queryInterface => {
    return queryInterface.removeColumn('Operators', 'allowOperatorDevices');
  },
};
