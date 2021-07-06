module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define(
    'User',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      publicKey: {
        type: DataTypes.STRING(88),
      },
      data: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      iv: {
        type: DataTypes.STRING,
      },
      mac: {
        type: DataTypes.STRING,
      },
      signature: {
        type: DataTypes.STRING,
      },
      deviceType: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
};
