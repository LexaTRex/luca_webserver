module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'LocationTransfers',
        'deletedAt',
        {
          allowNull: true,
          type: Sequelize.DATE,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        'TracingProcesses',
        'deletedAt',
        {
          allowNull: true,
          type: Sequelize.DATE,
        },
        { transaction }
      );
    });
  },

  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn('LocationTransfers', 'deletedAt', {
        transaction,
      });
      await queryInterface.removeColumn('TracingProcesses', 'deletedAt', {
        transaction,
      });
    });
  },
};
