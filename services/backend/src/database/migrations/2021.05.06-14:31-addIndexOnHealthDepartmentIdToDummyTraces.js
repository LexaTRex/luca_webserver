module.exports = {
  up: async queryInterface => {
    await queryInterface.addIndex('DummyTraces', {
      fields: ['healthDepartmentId'],
      concurrently: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeIndex(
      'DummyTraces',
      'dummy_traces_health_department_id'
    );
  },
};
