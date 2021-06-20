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
  const Operator = Sequelize.define(
    'Operator',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set() {
          throw new Error('Do not try to set the `fullName` value!');
        },
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: false,
      },
      username: {
        type: DataTypes.CITEXT,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publicKey: {
        type: DataTypes.STRING(88),
      },
      activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      privateKeySecret: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING(44),
      },
      supportCode: {
        allowNull: false,
        defaultValue: null,
        type: DataTypes.STRING(12),
      },
      avvAccepted: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      lastVersionSeen: {
        allowNull: false,
        defaultValue: '1.0.0',
        type: DataTypes.STRING(32),
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

  Operator.associate = models => {
    Operator.hasMany(models.Location, {
      foreignKey: 'operator',
      onDelete: 'CASCADE',
    });
  };

  Operator.prototype.checkPassword = async function checkPassword(
    testPassword
  ) {
    const hash = await scrypt(testPassword, this.get('salt'), KEY_LENGTH);
    return hash.toString('base64') === this.get('password');
  };

  return Operator;
};
