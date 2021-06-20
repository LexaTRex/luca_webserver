module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('LocationTransferTraces', {
      fields: ['locationTransferId'],
      type: 'FOREIGN KEY',
      references: {
        table: 'LocationTransfers',
        field: 'uuid',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'LocationTransferTraces',
      'LocationTransferTraces_locationTransferId_LocationTransfers_fk'
    );
  },
};
