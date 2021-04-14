module.exports = (Sequelize, DataTypes) => {
  const UserTransfer = Sequelize.define('UserTransfer', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    departmentId: {
      type: DataTypes.UUID,
    },
    tan: {
      type: DataTypes.STRING(12),
    },
    data: {
      type: DataTypes.STRING(2048),
    },
    iv: {
      type: DataTypes.STRING(24),
    },
    mac: {
      type: DataTypes.STRING(44),
    },
    publicKey: {
      type: DataTypes.STRING(88),
    },
    keyId: {
      type: DataTypes.INTEGER,
    },
  });

  UserTransfer.associate = () => {};

  return UserTransfer;
};
