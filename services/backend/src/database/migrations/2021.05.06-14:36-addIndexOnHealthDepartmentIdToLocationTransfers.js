module.exports = {
  up: async queryInterface => {
    await queryInterface.addIndex('LocationTransfers', {
      fields: ['departmentId'],
      concurrently: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeIndex(
      'LocationTransfers',
      'location_transfers_department_id'
    );
  },
};
