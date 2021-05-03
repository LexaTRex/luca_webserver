const crypto = require('crypto');

const UNAMBIGIOUS_CHARSET = 'ACDEFGHJKLMNPQRTUVWXY34679'.split('');
const PASSWORD_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}?><'.split(
  ''
);

const generateTAN = () => {
  const tan = [];
  for (let count = 0; count < 11; count += 1) {
    tan.push(UNAMBIGIOUS_CHARSET[crypto.randomInt(UNAMBIGIOUS_CHARSET.length)]);
  }
  tan.push('1');
  return tan.join('');
};

const generateSupportCode = () => {
  const supportCode = [];
  for (let count = 0; count < 12; count += 1) {
    supportCode.push(
      UNAMBIGIOUS_CHARSET[crypto.randomInt(UNAMBIGIOUS_CHARSET.length)]
    );
  }
  return supportCode.join('');
};

const generatePassword = () => {
  const password = [];
  for (let count = 0; count < 12; count += 1) {
    password.push(PASSWORD_CHARSET[crypto.randomInt(PASSWORD_CHARSET.length)]);
  }
  return password.join('');
};

module.exports = {
  generateTAN,
  generateSupportCode,
  generatePassword,
};
