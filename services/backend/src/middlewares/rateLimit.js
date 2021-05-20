const config = require('config');
const moment = require('moment');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const parsePhoneNumber = require('libphonenumber-js/max');
const { SHA256 } = require('@lucaapp/crypto');

const { isInternalIp, isRateLimitExemptIp } = require('../utils/ipChecks');

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

const phoneNumberKeyGenerator = request => {
  const phone = parsePhoneNumber(request.body.phone, 'DE');
  const hashedPhoneNumber = SHA256(phone.number);
  return `phone:${hashedPhoneNumber}`;
};

const isFixedLinePhoneNumber = request => {
  const phone = parsePhoneNumber(request.body.phone, 'DE');
  return phone.getType() === 'FIXED_LINE';
};

const minuteStore = new RedisStore({
  redisURL,
  expiry: minuteDuration.as('s'),
});

const hourStore = new RedisStore({
  redisURL,
  expiry: hourDuration.as('s'),
});

const dayStore = new RedisStore({
  redisURL,
  expiry: dayDuration.as('s'),
});

const limitRequestsPerMinute = (max, { skipSuccessfulRequests, global } = {}) =>
  new RateLimit({
    store: minuteStore,
    windowMs: minuteDuration.as('ms'),
    skip: request =>
      isInternalIp(request.ip) || isRateLimitExemptIp(request.ip),
    keyGenerator: global ? globalKeyGenerator : ipKeyGenerator,
    max,
    skipSuccessfulRequests,
  });

const limitRequestsPerHour = (max, { skipSuccessfulRequests, global } = {}) =>
  new RateLimit({
    store: hourStore,
    windowMs: hourDuration.as('ms'),
    skip: request =>
      isInternalIp(request.ip) || isRateLimitExemptIp(request.ip),
    keyGenerator: global ? globalKeyGenerator : ipKeyGenerator,
    max,
    skipSuccessfulRequests,
  });

const limitRequestsPerDay = (max, { skipSuccessfulRequests, global } = {}) =>
  new RateLimit({
    store: dayStore,
    windowMs: dayDuration.as('ms'),
    skip: request =>
      isInternalIp(request.ip) || isRateLimitExemptIp(request.ip),
    keyGenerator: global ? globalKeyGenerator : ipKeyGenerator,
    max,
    skipSuccessfulRequests,
  });

const limitRequestsByPhoneNumberPerDay = max =>
  new RateLimit({
    store: dayStore,
    windowMs: dayDuration.as('ms'),
    skip: request =>
      isInternalIp(request.ip) || isRateLimitExemptIp(request.ip),
    keyGenerator: phoneNumberKeyGenerator,
    max,
  });

const limitRequestsByFixedLinePhoneNumberPerDay = max =>
  new RateLimit({
    store: dayStore,
    windowMs: dayDuration.as('ms'),
    skip: request =>
      isInternalIp(request.ip) ||
      !isFixedLinePhoneNumber(request) ||
      isRateLimitExemptIp(request.ip),
    keyGenerator: phoneNumberKeyGenerator,
    max,
  });

module.exports = {
  limitRequestsPerMinute,
  limitRequestsPerHour,
  limitRequestsPerDay,
  limitRequestsByPhoneNumberPerDay,
  limitRequestsByFixedLinePhoneNumberPerDay,
};
