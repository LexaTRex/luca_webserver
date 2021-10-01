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
    locationFrontend: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    healthDepartmentFrontend: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    webapp: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    ios: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    android: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    operatorApp: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
  });
};
