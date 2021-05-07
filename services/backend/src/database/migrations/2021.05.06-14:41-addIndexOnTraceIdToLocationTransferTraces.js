module.exports = {
  up: async queryInterface => {
    await queryInterface.addIndex('LocationTransferTraces', {
      fields: ['traceId'],
      concurrently: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeIndex(
      'LocationTransferTraces',
      'location_transfer_traces_trace_id'
    );
  },
};
