const config = require('config');

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
      min: 1,
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
      min: 1,
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
