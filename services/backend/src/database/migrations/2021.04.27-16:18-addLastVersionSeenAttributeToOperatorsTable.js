module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Operators', 'lastVersionSeen', {
      type: DataTypes.STRING(32),
      defaultValue: '1.0.0',
      allowNull: false,
    });
  },
  down: async queryInterface => {
    return queryInterface.removeColumn('Operators', 'lastVersionSeen');
  },
};
