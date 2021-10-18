module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define(
    'IPAddressBlockList',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      startIp: {
        type: DataTypes.INET,
        allowNull: false,
      },
      endIp: {
        type: DataTypes.INET,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'IPAddressBlockList',
      timestamps: false,
      indexes: [
        {
          fields: ['startIp', 'endIp'],
          unique: true,
          name: 'unique_startip_endip_combo',
        },
      ],
    }
  );
};
