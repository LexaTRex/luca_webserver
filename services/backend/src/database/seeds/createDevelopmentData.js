const crypto = require('crypto');
const { v4: uuid } = require('uuid');
const faker = require('faker');
const { generateSupportCode } = require('../../utils/generators');

const DEVELOPMENT_EMAIL = 'luca@nexenio.com';

const hashPassword = plaintextPassword => {
  const salt = crypto.randomBytes(16).toString('base64');
  const password = crypto
    .scryptSync(plaintextPassword, salt, 64)
    .toString('base64');

  return {
    password,
    salt,
  };
};

const operators = [
  {
    uuid: uuid(),
    publicKey: null,
    activated: true,
    email: DEVELOPMENT_EMAIL,
    lastName: faker.name.lastName(),
    firstName: faker.name.firstName(),
    username: DEVELOPMENT_EMAIL,
    supportCode: generateSupportCode(),
    privateKeySecret: crypto.randomBytes(32).toString('base64'),
    ...hashPassword('testing'),
  },
];
const departments = [
  {
    uuid: uuid(),
    name: 'neXenio Testing',
    privateKeySecret: crypto.randomBytes(32).toString('base64'),
  },
];

const employees = [
  {
    uuid: uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: DEVELOPMENT_EMAIL,
    departmentId: departments[0].uuid,
    isAdmin: true,
    ...hashPassword('testing'),
  },
];

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Operators', operators);
    await queryInterface.bulkInsert('HealthDepartments', departments);
    await queryInterface.bulkInsert('HealthDepartmentEmployees', employees);
  },
  down: () => {},
};
