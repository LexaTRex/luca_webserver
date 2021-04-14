/* eslint-disable security/detect-object-injection */
const fs = require('fs');
const path = require('path');
const config = require('config');
const Sequelize = require('sequelize');

const environment = config.util.getEnv('NODE_ENV');
const logger = require('../../utils/logger');
const databaseConfig = require('../config.js')[environment];

const basename = path.basename(__filename);

const database = new Sequelize({
  ...databaseConfig,
  logging: (message, time) => logger.debug({ time, message }),
  logQueryParameters: false,
  benchmark: true,
});

/* eslint-disable-next-line security/detect-non-literal-fs-filename */
fs.readdirSync(__dirname)
  .filter(
    file =>
      !file.startsWith('.') &&
      file !== basename &&
      file.endsWith('.js') &&
      !file.endsWith('.test.js')
  )
  .forEach(file => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, security/detect-non-literal-require
    const model = require(path.join(__dirname, file))(
      database,
      Sequelize.DataTypes
    );
    database[model.name] = model;
  });

Object.keys(database).forEach(modelName => {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
});

module.exports = database;
