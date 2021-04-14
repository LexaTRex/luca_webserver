module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('IPAddressDenyList', {
      ipStart: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      ipEnd: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
    });

    await queryInterface.addIndex('IPAddressDenyList', {
      fields: ['ipStart'],
    });

    await queryInterface.addIndex('IPAddressDenyList', {
      fields: ['ipEnd'],
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('IPAddressDenyList');
  },
};
