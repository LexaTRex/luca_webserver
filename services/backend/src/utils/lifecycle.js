const config = require('config');
const moment = require('moment');
const logger = require('./logger').default;
const { sleep } = require('./sleep');

const state = {
  isShuttingDown: false,
};

const SHUTDOWN_DELAY = moment.duration(config.get('shutdownDelay'), 'seconds');
const shutdownHandlers = [];

const gracefulShutdown = async (isImmediate = false) => {
  if (state.isShuttingDown) return;
  state.isShuttingDown = true;

  if (!isImmediate) {
    logger.info(`shutting down in ${SHUTDOWN_DELAY.as('seconds')}s.`);
    await sleep(SHUTDOWN_DELAY.as('milliseconds'));
  }

  logger.info('starting shutdown');
  for (const shutdownHandler of shutdownHandlers) {
    await shutdownHandler();
  }
  logger.info('shutdown complete');
};

const sigtermHandler = () => {
  logger.info('SIGTERM received.');
  gracefulShutdown();
  process.exit(0);
};

const unhandledRejectionHandler = error => {
  logger.error(error, 'unhandledRejection');
  process.exit(1);
};

const uncaughtExceptionHandler = error => {
  logger.error(error, 'uncaughtException');
  process.exit(1);
};

const registerShutdownHandler = shutdownHandler => {
  shutdownHandlers.push(shutdownHandler);
};

const registerHooks = () => {
  process.on('SIGTERM', sigtermHandler);
  process.on('uncaughtException', uncaughtExceptionHandler);
  process.on('unhandledRejection', unhandledRejectionHandler);
};

module.exports = {
  gracefulShutdown,
  registerShutdownHandler,
  registerHooks,
  state,
};
