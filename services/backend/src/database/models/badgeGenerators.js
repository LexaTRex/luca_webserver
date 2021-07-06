module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('BadgeGenerator', {
    token: {
      type: DataTypes.STRING(44),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
  });
};
