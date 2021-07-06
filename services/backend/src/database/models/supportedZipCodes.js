module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('SupportedZipCode', {
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  });
};
