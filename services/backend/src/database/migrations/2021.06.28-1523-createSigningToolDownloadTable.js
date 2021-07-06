module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('SigningToolDownloads', {
      version: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      downloadUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false,
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('SigningToolDownloads');
  },
};
