module.exports = (Sequelize, DataTypes) => {
  const TestRedeem = Sequelize.define('TestRedeem', {
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

  TestRedeem.associate = () => {};

  return TestRedeem;
};
