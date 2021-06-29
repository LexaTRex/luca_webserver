module.exports = {
  up: async queryInterface => {
    await queryInterface.dropTable('BadgeRegistrators');
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.createTable('BadgeRegistrators', {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(255),
      },
    });
  },
};
