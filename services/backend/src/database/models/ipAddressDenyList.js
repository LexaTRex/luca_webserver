module.exports = (Sequelize, DataTypes) => {
  const IPAddressDenyList = Sequelize.define(
    'IPAddressDenyList',
    {
      ipStart: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      ipEnd: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: 'IPAddressDenyList',
      timestamps: false,
    }
  );

  IPAddressDenyList.associate = () => {};

  return IPAddressDenyList;
};
