const moment = require('moment');
const logger = require('./logger');
const { sleep } = require('./sleep');

const state = {
  isShuttingDown: false,
};

const SHUTDOWN_DELAY = moment.duration(15, 'seconds');
const shutdownHandlers = [];

const gracefulShutdown = async () => {
  if (state.isShuttingDown) return;
  state.isShuttingDown = true;
  logger.info(`shutting down in ${SHUTDOWN_DELAY.as('seconds')}s.`);

  await sleep(SHUTDOWN_DELAY.as('milliseconds'));

  logger.info('starting shutdown');
  for (const shutdownHandler of shutdownHandlers) {
    await shutdownHandler();
  }
  logger.info('shutdown complete');
  process.exit(0);
};

const sigtermHandler = () => {
  logger.info('SIGTERM received.');
  gracefulShutdown();
};

const unhandledRejectionHandler = error => {
  logger.error('unhandledRejection', error);
  process.exit(1);
};

const uncaughtExceptionHandler = error => {
  logger.error('uncaughtException', error);
  process.exit(1);
};

const registerShutdownHandler = shutdownHandler => {
  shutdownHandlers.push(shutdownHandler);
};

process.on('SIGTERM', sigtermHandler);
process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', unhandledRejectionHandler);

module.exports = {
  registerShutdownHandler,
  state,
};
