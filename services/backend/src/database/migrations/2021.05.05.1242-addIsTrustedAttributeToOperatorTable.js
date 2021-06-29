module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Operators', 'isTrusted', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
  down: async queryInterface => {
    return queryInterface.removeColumn('Operators', 'isTrusted');
  },
};
