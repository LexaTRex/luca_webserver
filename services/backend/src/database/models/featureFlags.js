module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('FeatureFlag', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
    },
  });
};
