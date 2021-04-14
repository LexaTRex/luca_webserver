const config = require('config');
const Sequelize = require('sequelize');

module.exports = {
  production: {
    dialect: 'postgres',
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    host: config.get('db.host'),
    replication: {
      read: [
        {
          host: config.get('db.host_read1'),
        },
        {
          host: config.get('db.host_read2'),
        },
        {
          host: config.get('db.host_read3'),
        },
      ],
      write: {
        host: config.get('db.host'),
      },
    },
    pool: {
      max: 20,
      min: 0,
    },
    retry: {
      max: 3,
      match: [
        Sequelize.ConnectionError,
        Sequelize.ConnectionRefusedError,
        Sequelize.ConnectionTimedOutError,
      ],
    },
    seederStorage: 'sequelize',
    seederStorageTableName: '_Seeds',
    migrationStorageTableName: '_Migrations',
  },
  development: {
    dialect: 'postgres',
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    host: config.get('db.host'),
    pool: {
      max: 5,
      min: 0,
    },
    retry: {
      max: 50,
      match: [
        Sequelize.ConnectionError,
        Sequelize.ConnectionRefusedError,
        Sequelize.ConnectionTimedOutError,
      ],
    },
    seederStorage: 'sequelize',
    seederStorageTableName: '_Seeds',
    migrationStorageTableName: '_Migrations',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
};
