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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
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

  HealthDepartmentEmployee.associate = () => {};

  HealthDepartmentEmployee.prototype.checkPassword = async function checkPassword(
    testPassword
  ) {
    const hash = await scrypt(testPassword, this.get('salt'), KEY_LENGTH);
    return hash.toString('base64') === this.get('password');
  };
  return HealthDepartmentEmployee;
};
