// eslint-disable-next-line import/order
const lifecycle = require('./utils/lifecycle');
const http = require('http');
const config = require('config');
const logger = require('./utils/logger');
const { configureApp } = require('./app');

const database = require('./database');

let server;

const startHTTPServer = async () => {
  logger.info('starting http server');
  server = http.createServer(configureApp());
  server.listen(config.get('port'));

  await new Promise(resolve => {
    server.on('listening', () => {
      logger.info(`http server listening on ${config.get('port')}`);
      resolve();
    });
  });
};

const stopHTTPServer = async () => {
  logger.info('stopping http server');
  await new Promise((resolve, reject) => {
    server.close(error => {
      if (error) return reject(error);
      logger.info('http server stopped');
      return resolve();
    });
  });
};

const connectDatabase = async () => {
  logger.info('connecting to database');
  await database.authenticate();
  logger.info('connected to database');
};

const main = async () => {
  logger.info(
    `running with PID ${process.pid} in ${process.env.NODE_ENV} mode`
  );

  await connectDatabase();
  await startHTTPServer();
  lifecycle.registerShutdownHandler(stopHTTPServer);
};

main();
