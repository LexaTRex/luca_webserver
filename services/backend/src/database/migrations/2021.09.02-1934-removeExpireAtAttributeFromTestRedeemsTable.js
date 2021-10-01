module.exports = {
  up: async queryInterface => {
    await queryInterface.removeColumn('TestRedeems', 'expireAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TestRedeems', 'expireAt', {
      type: Sequelize.DATE,
    });
  },
};
