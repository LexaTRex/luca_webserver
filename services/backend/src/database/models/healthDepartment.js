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
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      privateKeySecret: {
        type: DataTypes.STRING(44),
        allowNull: false,
        defaultValue: null,
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publicHDEKP: {
        type: DataTypes.STRING(88),
      },
      publicHDSKP: {
        type: DataTypes.STRING(88),
      },
      commonName: {
        type: DataTypes.STRING(255),
      },
      publicCertificate: {
        type: DataTypes.STRING(8192),
      },
      signedPublicHDEKP: {
        type: DataTypes.STRING(2048),
      },
      signedPublicHDSKP: {
        type: DataTypes.STRING(2048),
      },
      notificationsEnabled: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
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

    HealthDepartment.hasMany(models.DummyTrace, {
      foreignKey: 'healthDepartmentId',
    });

    HealthDepartment.hasMany(models.HealthDepartmentEmployee, {
      foreignKey: 'departmentId',
    });

    HealthDepartment.hasMany(models.HealthDepartmentAuditLog, {
      foreignKey: 'departmentId',
    });

    HealthDepartment.hasMany(models.NotificationMessage, {
      foreignKey: 'departmentId',
    });
  };

  return HealthDepartment;
};
