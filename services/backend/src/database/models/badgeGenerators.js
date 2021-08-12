const { promisify } = require('util');
const scrypt = promisify(require('crypto').scrypt);
const config = require('config');

module.exports = (Sequelize, DataTypes) => {
  const BadgeGenerator = Sequelize.define('BadgeGenerator', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(255),
    },
    salt: {
      type: DataTypes.STRING(255),
    },
  });

  BadgeGenerator.prototype.checkPassword = async function checkPassword(
    testPassword
  ) {
    const hash = await scrypt(
      testPassword,
      this.get('salt'),
      config.get('keys.badge.keyLength')
    );
    return hash.toString('base64') === this.get('password');
  };

  return BadgeGenerator;
};
