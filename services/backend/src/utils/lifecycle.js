const logger = require('./logger');

const state = {
  isShuttingDown: false,
};

const SHUTDOWN_DELAY_MS = 15 * 1000;

const shutdown = httpServer => {
  httpServer.close(error => {
    if (error) {
      logger.error(error);
      process.exit(1);
    }
    logger.info('shutdown complete');
    process.exit();
  });
};

const sigtermHandler = httpServer => {
  logger.info('SIGTERM received.');
  logger.info('shutting down in 15s.');
  state.isShuttingDown = true;
  setTimeout(() => shutdown(httpServer), SHUTDOWN_DELAY_MS);
};

module.exports = {
  sigtermHandler,
  state,
};
