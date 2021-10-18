module.exports = {
  up: async queryInterface =>
    queryInterface.addIndex('LocationTransfers', {
      name: 'location_transfers_time',
      fields: ['time'],
      using: 'gist',
    }),
  down: async queryInterface =>
    queryInterface.removeIndex('LocationTransfers', 'location_transfers_time'),
};
