module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('BadgePublicKey', {
    keyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      defaultValue: 0,
    },
    publicKey: {
      type: DataTypes.STRING(88),
      allowNull: false,
    },
    issuerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
