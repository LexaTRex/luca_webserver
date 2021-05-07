module.exports = {
  up: async queryInterface => {
    await queryInterface.addIndex('LocationTransfers', {
      fields: ['createdAt'],
      concurrently: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeIndex(
      'LocationTransfers',
      'location_transfers_created_at'
    );
  },
};
