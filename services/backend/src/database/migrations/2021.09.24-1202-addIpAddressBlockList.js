module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'IPAddressBlockList',
        {
          uuid: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
          },
          startIp: {
            type: DataTypes.INET,
            allowNull: false,
          },
          endIp: {
            type: DataTypes.INET,
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction }
      );

      await queryInterface.addIndex('IPAddressBlockList', {
        fields: [{ name: 'startIp', operator: 'inet_ops' }],
        using: 'gist',
        transaction,
      });
      await queryInterface.addIndex('IPAddressBlockList', {
        fields: [{ name: 'endIp', operator: 'inet_ops' }],
        using: 'gist',
        transaction,
      });
      await queryInterface.addIndex('IPAddressBlockList', {
        fields: ['createdAt'],
        transaction,
      });
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('IPAddressBlockList');
  },
};
