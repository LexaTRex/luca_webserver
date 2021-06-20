module.exports = {
  up: async queryInterface => {
    await queryInterface.addIndex('LocationTransferTraces', {
      fields: ['locationTransferId'],
      concurrently: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeIndex(
      'LocationTransferTraces',
      'location_transfer_traces_location_transfer_id'
    );
  },
};
