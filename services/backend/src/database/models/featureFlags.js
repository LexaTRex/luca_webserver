module.exports = (Sequelize, DataTypes) => {
  const FeatureFlag = Sequelize.define('FeatureFlag', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
    },
  });

  FeatureFlag.associate = () => {};

  return FeatureFlag;
};
