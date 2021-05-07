module.exports = {
  up: async queryInterface => {
    await queryInterface.addIndex('DummyTraces', {
      fields: ['createdAt'],
      concurrently: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeIndex('DummyTraces', 'dummy_traces_created_at');
  },
};
