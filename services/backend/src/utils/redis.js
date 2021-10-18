const config = require('config');
const redis = require('redis');
const { promisify } = require('util');
const logger = require('./logger').default;
const lifecycle = require('./lifecycle');

const RETRY_INTERVAL_MS = 500;

const retryStrategy = info => {
  logger.warn(info, `retrying redis connection`);
  return RETRY_INTERVAL_MS;
};

const client = redis.createClient({
  host: config.get('redis.hostname'),
  password: config.get('redis.password'),
  enable_offline_queue: true,
  detect_buffers: true,
  db: config.get('redis.database'),
  retry_strategy: retryStrategy,
});

client.on('error', error => {
  logger.error(error);
});

const promiseClient = {
  client,
  quit: promisify(client.quit).bind(client),
  set: promisify(client.set).bind(client),
  get: promisify(client.get).bind(client),
};

lifecycle.registerShutdownHandler(async () => {
  logger.info('closing redis connection');
  await promiseClient.quit();
  logger.info('redis connection closed');
});

module.exports = promiseClient;
