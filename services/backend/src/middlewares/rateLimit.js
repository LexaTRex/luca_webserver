const config = require('config');
const moment = require('moment');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const parsePhoneNumber = require('libphonenumber-js/max');
const { SHA256 } = require('@lucaapp/crypto');
const { client } = require('../utils/redis');

const { isInternalIp, isRateLimitExemptIp } = require('../utils/ipChecks');

const minuteDuration = moment.duration(1, 'minute');
const hourDuration = moment.duration(1, 'hour');
const dayDuration = moment.duration(1, 'day');

const DEFAULT_RATE_LIMIT_MINUTE = config.get(
  `rate_limits.default_rate_limit_minute`
);
const DEFAULT_RATE_LIMIT_HOUR = config.get(
  `rate_limits.default_rate_limit_hour`
);
const DEFAULT_RATE_LIMIT_DAY = config.get(`rate_limits.default_rate_limit_day`);

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
  client,
  expiry: minuteDuration.as('s'),
});

const hourStore = new RedisStore({
  client,
  expiry: hourDuration.as('s'),
});

const dayStore = new RedisStore({
  client,
  expiry: dayDuration.as('s'),
});

const limitRequestsByFeatureFlag = (
  key = '',
  { skipSuccessfulRequests, global },
  rateLimitOptions
) => (request, response, next) => {
  const max = config.get(`rate_limits.${key}`);
  const rateLimit = new RateLimit({
    skip: ({ ip }) => isInternalIp(ip) || isRateLimitExemptIp(ip),
    keyGenerator: global ? globalKeyGenerator : ipKeyGenerator,
    max,
    skipSuccessfulRequests,
    ...rateLimitOptions,
  });

  rateLimit(request, response, next);
};

const limitRequestsPerMinute = (key, { skipSuccessfulRequests, global } = {}) =>
  limitRequestsByFeatureFlag(
    key || DEFAULT_RATE_LIMIT_MINUTE,
    { skipSuccessfulRequests, global },
    {
      store: minuteStore,
      windowMs: minuteDuration.as('ms'),
    }
  );

const limitRequestsPerHour = (key, { skipSuccessfulRequests, global } = {}) =>
  limitRequestsByFeatureFlag(
    key || DEFAULT_RATE_LIMIT_HOUR,
    { skipSuccessfulRequests, global },
    {
      store: hourStore,
      windowMs: hourDuration.as('ms'),
    }
  );

const limitRequestsPerDay = (key, { skipSuccessfulRequests, global } = {}) =>
  limitRequestsByFeatureFlag(
    key || DEFAULT_RATE_LIMIT_DAY,
    { skipSuccessfulRequests, global },
    {
      store: dayStore,
      windowMs: dayDuration.as('ms'),
    }
  );

const limitRequestsByPhoneNumberPerDay = key =>
  limitRequestsByFeatureFlag(
    key,
    {},
    {
      store: dayStore,
      windowMs: dayDuration.as('ms'),
      keyGenerator: phoneNumberKeyGenerator,
    }
  );

const limitRequestsByFixedLinePhoneNumberPerDay = key =>
  limitRequestsByFeatureFlag(
    key,
    {},
    {
      store: dayStore,
      windowMs: dayDuration.as('ms'),
      skip: request =>
        isInternalIp(request.ip) ||
        !isFixedLinePhoneNumber(request) ||
        isRateLimitExemptIp(request.ip),
      keyGenerator: phoneNumberKeyGenerator,
    }
  );

module.exports = {
  limitRequestsPerMinute,
  limitRequestsPerHour,
  limitRequestsPerDay,
  limitRequestsByPhoneNumberPerDay,
  limitRequestsByFixedLinePhoneNumberPerDay,
};
