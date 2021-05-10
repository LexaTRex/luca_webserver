module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('TestRedeems', {
      hash: {
        type: DataTypes.STRING(44),
        allowNull: false,
        primaryKey: true,
      },
      tag: {
        type: DataTypes.STRING(24),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('TestRedeems');
  },
};
