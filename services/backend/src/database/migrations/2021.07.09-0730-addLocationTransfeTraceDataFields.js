module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'LocationTransferTraces',
        'isHDEncrypted',
        {
          type: Sequelize.BOOLEAN,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'LocationTransferTraces',
        'dataPublicKey',
        {
          type: Sequelize.STRING(88),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'LocationTransferTraces',
        'dataMAC',
        {
          type: Sequelize.STRING(44),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'LocationTransferTraces',
        'dataIV',
        {
          type: Sequelize.STRING(24),
        },
        { transaction }
      );
    });
  },

  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        'LocationTransferTraces',
        'isHDEncrypted',
        { transaction }
      );
      await queryInterface.removeColumn(
        'LocationTransferTraces',
        'dataPublicKey',
        { transaction }
      );
      await queryInterface.removeColumn('LocationTransferTraces', 'dataMAC', {
        transaction,
      });
      await queryInterface.removeColumn('LocationTransferTraces', 'expireAt', {
        transaction,
      });
      await queryInterface.removeColumn('LocationTransferTraces', 'dataIV', {
        transaction,
      });
    });
  },
};
