import lifecycle from 'utils/lifecycle';
import http from 'http';
import config from 'config';
import metrics from 'utils/metrics';
import logger from 'utils/logger';
import { database } from 'database';
import { loadCertificates } from 'utils/signedKeys';

import { configureApp } from './app';

let server: http.Server;

const startHTTPServer = async () => {
  logger.info('starting http server');
  server = http.createServer(configureApp());
  server.listen(config.get('port'));

  await new Promise<void>(resolve => {
    server.on('listening', () => {
      logger.info(`http server listening on ${config.get('port')}`);
      resolve();
    });
  });
};

const stopHTTPServer = async () => {
  logger.info('stopping http server');
  await new Promise<void>((resolve, reject) => {
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
  lifecycle.registerHooks();
  metrics.client.collectDefaultMetrics();
  loadCertificates();
  await connectDatabase();
  await startHTTPServer();
  lifecycle.registerShutdownHandler(stopHTTPServer);
};

main();
