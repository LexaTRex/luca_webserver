const config = require('config');
const moment = require('moment');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const { isInternalIp } = require('../utils/ipChecks');

const redisURL = `redis://${config.get('redis.hostname')}?password=${config.get(
  'redis.password'
)}`;

const minuteDuration = moment.duration(1, 'minute');
const hourDuration = moment.duration(1, 'hour');
const dayDuration = moment.duration(1, 'day');

const ipKeyGenerator = request => {
  return `${request.ip}:${request.baseUrl}${request.route.path}`.toLowerCase();
};

const globalKeyGenerator = request => {
  return `global:${request.baseUrl}${request.route.path}`.toLowerCase();
};

let minuteStore;
let hourStore;
let dayStore;

const initialize = () => {
  minuteStore = new RedisStore({
    redisURL,
    expiry: minuteDuration.as('s'),
  });

  hourStore = new RedisStore({
    redisURL,
    expiry: hourDuration.as('s'),
  });

  dayStore = new RedisStore({
    redisURL,
    expiry: dayDuration.as('s'),
  });
};

const limitRequestsPerMinute = (max, { skipSuccessfulRequests, global } = {}) =>
  new RateLimit({
    store: minuteStore,
    windowMs: minuteDuration.as('ms'),
    skip: request => isInternalIp(request.ip),
    keyGenerator: global ? globalKeyGenerator : ipKeyGenerator,
    max,
    skipSuccessfulRequests,
  });

const limitRequestsPerHour = (max, { skipSuccessfulRequests, global } = {}) =>
  new RateLimit({
    store: hourStore,
    windowMs: hourDuration.as('ms'),
    skip: request => isInternalIp(request.ip),
    keyGenerator: global ? globalKeyGenerator : ipKeyGenerator,
    max,
    skipSuccessfulRequests,
  });

const limitRequestsPerDay = (max, { skipSuccessfulRequests, global } = {}) =>
  new RateLimit({
    store: dayStore,
    windowMs: dayDuration.as('ms'),
    skip: request => isInternalIp(request.ip),
    keyGenerator: global ? globalKeyGenerator : ipKeyGenerator,
    max,
    skipSuccessfulRequests,
  });

module.exports = {
  limitRequestsPerMinute,
  limitRequestsPerHour,
  limitRequestsPerDay,
  initialize,
};
