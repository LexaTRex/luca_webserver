const config = require('config');
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  host: config.get('redis.hostname'),
  password: config.get('redis.password'),
  enable_offline_queue: false,
});

module.exports = {
  client,
  quit: promisify(client.quit).bind(client),
  set: promisify(client.set).bind(client),
  get: promisify(client.get).bind(client),
};
