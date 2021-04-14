module.exports = (Sequelize, DataTypes) => {
  const BadgeGenerator = Sequelize.define('BadgeGenerator', {
    token: {
      type: DataTypes.STRING(44),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
  });

  BadgeGenerator.associate = () => {};

  return BadgeGenerator;
};
