module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define(
    'SigningToolDownload',
    {
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
    },
    {
      timestamps: false,
    }
  );
};
