const { promisify } = require('util');
const scrypt = promisify(require('crypto').scrypt);

const KEY_LENGTH = 64;

const hashPasswordHook = async instance => {
  if (!instance.changed('password')) return;
  const password = instance.get('password');
  const salt = instance.get('salt');
  const hash = await scrypt(password, salt, KEY_LENGTH);
  await instance.set('password', hash.toString('base64'));
};

module.exports = (Sequelize, DataTypes) => {
  const HealthDepartmentEmployee = Sequelize.define(
    'HealthDepartmentEmployee',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      hooks: {
        beforeCreate: hashPasswordHook,
        beforeUpdate: hashPasswordHook,
      },
    }
  );

  HealthDepartmentEmployee.associate = models => {
    HealthDepartmentEmployee.belongsTo(models.HealthDepartment, {
      foreignKey: 'departmentId',
    });

    HealthDepartmentEmployee.hasMany(models.TracingProcess, {
      foreignKey: 'assigneeId',
    });

    HealthDepartmentEmployee.hasMany(models.HealthDepartmentAuditLog, {
      foreignKey: 'employeeId',
    });
  };

  HealthDepartmentEmployee.prototype.checkPassword = async function checkPassword(
    testPassword
  ) {
    const hash = await scrypt(testPassword, this.get('salt'), KEY_LENGTH);
    return hash.toString('base64') === this.get('password');
  };
  return HealthDepartmentEmployee;
};
