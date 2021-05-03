module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Operators', 'avvAccepted', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
  down: async queryInterface => {
    return queryInterface.removeColumn('Operators', 'avvAccepted');
  },
};
