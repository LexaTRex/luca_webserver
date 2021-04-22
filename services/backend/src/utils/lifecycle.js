const moment = require('moment');
const logger = require('./logger');
const redis = require('./redis');

const state = {
  isShuttingDown: false,
};

const SHUTDOWN_DELAY = moment.duration(15, 'seconds');

const shutdown = httpServer => {
  httpServer.close(async error => {
    if (error) {
      logger.error(error);
      process.exit(1);
    }
    await redis.quit();
    logger.info('shutdown complete');
    process.exit();
  });
};

const sigtermHandler = httpServer => {
  logger.info('SIGTERM received.');
  if (state.isShuttingDown) return;
  logger.info(`shutting down in ${SHUTDOWN_DELAY.seconds()}s.`);
  state.isShuttingDown = true;
  setTimeout(() => shutdown(httpServer), SHUTDOWN_DELAY.asMilliseconds());
};

module.exports = {
  sigtermHandler,
  state,
};
