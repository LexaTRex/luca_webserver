module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.addColumn('Locations', 'isIndoor', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },
  down: async queryInterface => {
    return queryInterface.removeColumn('Locations', 'isIndoor');
  },
};
