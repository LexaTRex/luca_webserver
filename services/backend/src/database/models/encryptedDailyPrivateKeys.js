module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('EncryptedDailyPrivateKey', {
    keyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      unique: 'primaryKey',
      primaryKey: true,
    },
    healthDepartmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'primaryKey',
      primaryKey: true,
    },
    issuerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING(44),
      allowNull: false,
    },
    iv: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    mac: {
      type: DataTypes.STRING(44),
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.STRING(88),
      allowNull: false,
    },
    signature: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
  });
};
