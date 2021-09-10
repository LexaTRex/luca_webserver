module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'LocationTransfers',
        'approvedAt',
        {
          allowNull: true,
          type: Sequelize.DATE,
        },
        {
          transaction,
        }
      );
    });
  },

  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn('LocationTransfers', 'approvedAt', {
        transaction,
      });
    });
  },
};
