module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('NotificationChunk', {
    chunk: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
  });
};
