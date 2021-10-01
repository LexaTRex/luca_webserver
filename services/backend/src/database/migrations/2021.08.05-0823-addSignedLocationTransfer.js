module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'LocationTransfers',
        'signedLocationTransfer',
        {
          type: Sequelize.STRING(1024),
          allowNull: true,
          defaultValue: null,
        },
        { transaction }
      );
    });
  },

  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        'LocationTransfers',
        'signedLocationTransfer',
        {
          transaction,
        }
      );
    });
  },
};
