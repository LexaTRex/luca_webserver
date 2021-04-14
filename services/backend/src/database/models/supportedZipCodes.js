module.exports = (Sequelize, DataTypes) => {
  const SupportedZipCode = Sequelize.define('SupportedZipCode', {
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  });

  SupportedZipCode.associate = () => {};

  return SupportedZipCode;
};
