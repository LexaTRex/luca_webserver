module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define(
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
};
