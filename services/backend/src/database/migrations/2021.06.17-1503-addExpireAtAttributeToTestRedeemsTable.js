module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TestRedeems', 'expireAt', {
      type: Sequelize.DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('TestRedeems', 'expireAt');
  },
};
