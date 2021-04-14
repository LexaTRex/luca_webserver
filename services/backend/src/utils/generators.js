const faker = require('faker');

const UNAMBIGIOUS_CHARSET = [
  'A',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  '3',
  '4',
  '6',
  '7',
  '9',
];

const generateTAN = () => {
  const tan = [];
  for (let count = 0; count < 11; count += 1) {
    tan.push(faker.random.arrayElement(UNAMBIGIOUS_CHARSET));
  }
  tan.push('1');
  return tan.join('');
};

const generateSupportCode = () => {
  const supportCode = [];
  for (let count = 0; count < 12; count += 1) {
    supportCode.push(faker.random.arrayElement(UNAMBIGIOUS_CHARSET));
  }
  return supportCode.join('');
};

module.exports = {
  generateTAN,
  generateSupportCode,
};
