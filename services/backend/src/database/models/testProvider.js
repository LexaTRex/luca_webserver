module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('TestProvider', {
    fingerprint: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.STRING(8192),
      allowNull: false,
    },
  });
};
