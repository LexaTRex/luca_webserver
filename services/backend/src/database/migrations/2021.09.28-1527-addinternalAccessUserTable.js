module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('InternalAccessUsers', {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING(255),
      },
      salt: {
        type: DataTypes.STRING(255),
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
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('InternalAccessUsers');
  },
};
