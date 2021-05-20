module.exports = (Sequelize, DataTypes) => {
  const IPAddressAllowList = Sequelize.define(
    'IPAddressAllowList',
    {
      ip: {
        type: DataTypes.INET,
        allowNull: false,
        primaryKey: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rateLimitFactor: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'IPAddressAllowList',
      timestamps: false,
    }
  );

  IPAddressAllowList.associate = () => {};

  return IPAddressAllowList;
};
