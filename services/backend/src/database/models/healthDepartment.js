module.exports = (Sequelize, DataTypes) => {
  const HealthDepartment = Sequelize.define(
    'HealthDepartment',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      privateKeySecret: {
        allowNull: false,
        defaultValue: null,
        type: DataTypes.STRING(44),
      },
      publicHDEKP: {
        type: DataTypes.STRING(88),
      },
      publicHDSKP: {
        type: DataTypes.STRING(88),
      },
    },
    {
      paranoid: true,
    }
  );

  HealthDepartment.associate = models => {
    HealthDepartment.hasMany(models.LocationTransfer, {
      foreignKey: 'departmentId',
    });
  };

  return HealthDepartment;
};
