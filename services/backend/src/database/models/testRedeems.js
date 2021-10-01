module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('TestRedeem', {
    hash: {
      type: DataTypes.STRING(44),
      allowNull: false,
      primaryKey: true,
    },
    tag: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
  });
};
