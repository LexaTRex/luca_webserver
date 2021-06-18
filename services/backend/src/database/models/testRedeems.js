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
    expireAt: {
      type: DataTypes.DATE,
    },
  });

  TestRedeem.associate = () => {};

  return TestRedeem;
};
