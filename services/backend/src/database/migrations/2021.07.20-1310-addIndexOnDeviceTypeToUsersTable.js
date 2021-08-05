module.exports = {
  up: async queryInterface => {
    await queryInterface.addIndex('Users', {
      name: 'users_device_type_index',
      fields: ['deviceType'],
      concurrently: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeIndex('Users', 'users_device_type_index');
  },
};
