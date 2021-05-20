module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('IPAddressAllowList', {
      ip: {
        type: Sequelize.INET,
        allowNull: false,
        primaryKey: true,
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rateLimitFactor: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
    await queryInterface.addIndex('IPAddressAllowList', {
      fields: [{ name: 'ip', operator: 'inet_ops' }],
      using: 'gist',
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('IPAddressAllowList');
  },
};
