module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable('NotificationChunks', {
      chunk: {
        type: DataTypes.BLOB,
        allowNull: false,
      },
      hash: {
        type: DataTypes.STRING(24),
        allowNull: false,
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
    }),
  down: queryInterface => queryInterface.dropTable('NotificationChunks'),
};
