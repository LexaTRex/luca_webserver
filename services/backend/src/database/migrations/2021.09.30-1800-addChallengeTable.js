module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Challenges', {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING(32),
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING(32),
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Challenges');
  },
};
