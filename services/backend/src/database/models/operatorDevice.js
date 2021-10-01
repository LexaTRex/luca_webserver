const {
  OperatorDevice: OperatorDeviceType,
  // eslint-disable-next-line node/no-missing-require
} = require('constants/operatorDevice');

module.exports = (Sequelize, DataTypes) => {
  const OperatorDevice = Sequelize.define('OperatorDevice', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    activated: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    name: {
      type: DataTypes.STRING(64),
    },
    os: {
      defaultValue: 'unknown',
      type: DataTypes.STRING(8),
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM([
        OperatorDeviceType.scanner,
        OperatorDeviceType.employee,
        OperatorDeviceType.manager,
      ]),
    },
    reactivatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    refreshedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  OperatorDevice.associate = models => {
    OperatorDevice.belongsTo(models.Operator, {
      foreignKey: 'operatorId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return OperatorDevice;
};
