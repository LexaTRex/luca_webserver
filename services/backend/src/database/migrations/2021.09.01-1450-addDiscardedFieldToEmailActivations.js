module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('EmailActivations', 'discarded', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('EmailActivations', 'discarded');
  },
};
