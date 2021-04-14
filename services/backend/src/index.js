const http = require('http');
const config = require('config');
const logger = require('./utils/logger');
const { configureApp } = require('./app');

const database = require('./database');
const rateLimit = require('./middlewares/rateLimit');
const { sigtermHandler } = require('./utils/lifecycle');

const run = async () => {
  logger.info(`running with PID ${process.pid}`);

  try {
    logger.info('Trying to connect to database');
    await database.authenticate();
  } catch (error) {
    logger.error('Failed to connect to database', error);
    return;
  }
  logger.info('Connected to database');

  try {
    logger.info('Trying to connect to redis');
    await rateLimit.initialize();
  } catch (error) {
    logger.error('Failed to connect to redis', error);
    return;
  }
  logger.info('Connected to redis');

  const server = http.createServer(configureApp(database));

  server.listen(config.get('port'), () => {
    logger.info(`Listening on ${server.address().port}`);
  });

  process.on('SIGTERM', () => sigtermHandler(server, database));
};

run();
