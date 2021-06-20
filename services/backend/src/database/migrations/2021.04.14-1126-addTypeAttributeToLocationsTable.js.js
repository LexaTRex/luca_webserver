module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Locations', 'type', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'base',
    });
  },
  down: async queryInterface => {
    return queryInterface.removeColumn('Locations', 'type');
  },
};
