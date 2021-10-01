module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Locations', 'averageCheckinTime', {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true,
    });
  },
  down: async queryInterface => {
    return queryInterface.removeColumn('Locations', 'averageCheckinTime');
  },
};
