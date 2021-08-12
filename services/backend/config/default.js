const fs = require('fs');
const moment = require('moment');

let ROOT_CA;
let BASIC_CA;

try {
  ROOT_CA = fs.readFileSync('./certs/root.pem');
  BASIC_CA = fs.readFileSync('./certs/basic.pem');
} catch {
  ROOT_CA = '';
  BASIC_CA = '';
}

module.exports = {
  e2e: true,
  debug: true,
  loglevel: 'info',
  hostname: 'localhost',
  skipSmsVerification: true,
  shutdownDelay: 0,
  port: 8080,
  cookies: {
    // DEV ONLY TOKEN
    secret: 'NJrbMwHlI2uILDVkN0w6Aw==',
    maxAge: moment.duration(15, 'minutes').as('ms'),
    name: 'connect.sid',
    path: '/api',
  },
  db: {
    host: 'database',
    host_read1: 'database',
    host_read2: 'database',
    host_read3: 'database',
    username: 'luca',
    password: 'lcadmin',
    database: 'luca-backend',
  },
  redis: {
    hostname: 'redis',
    password:
      // DEV ONLY TOKEN
      'ConqsCqWd]eaR82wv%C.iDdRybor8Ms2bM*h=m?V3@x2w^UxKA9pEjMjHn^y7?78',
  },
  mailer: {
    apiUrl: '',
    apiKey: '',
    apiSecret: '',
  },
  messagemobile: {
    accessKey: '',
    gateway: '',
  },
  sinch: {
    cid: '',
    password: '',
    gateway1: '',
    gateway2: '',
  },
  gtx: {
    authKey: '',
    gateway: '',
  },
  luca: {
    traces: {
      maximumRequestablePeriod: moment.duration(24, 'hours').as('hours'),
      maxAge: moment.duration(28, 'days').as('hours'),
      maxDuration: moment.duration(24, 'hours').as('hours'),
    },
    locationTransfers: {
      maxLocations: 100 * 14, // Max 100 location transfers per day for 14 days of contact tracing
    },
    smsChallenges: {
      maxAge: moment.duration(45, 'days').as('hours'),
    },
    userTransfers: {
      maxAge: moment.duration(48, 'hours').as('hours'),
    },
    locations: {
      maxAge: moment.duration(28, 'days').as('hours'),
    },
    operators: {
      deleted: {
        maxAgeHours: moment.duration(28, 'days').as('hours'),
      },
    },
    users: {
      maxAge: moment.duration(28, 'days').as('hours'),
    },
    tracingProcess: {
      maxAge: moment.duration(28, 'days').as('hours'),
    },
    testRedeems: {
      defaultMaxAge: moment.duration(72, 'hours').as('hours'),
      maxAge: moment.duration(1, 'years').as('hours'),
    },
  },
  emails: {
    expiry: moment.duration(24, 'hours').as('hours'),
  },
  sms: {
    expiry: moment.duration(1, 'hours').as('hours'),
  },
  proxy: {
    http: null,
    https: null,
  },
  keys: {
    daily: {
      max: 28,
      minKeyAge: moment.duration(24, 'hours').as('hours'),
    },
    badge: {
      targetKeyId: 2,
      keyLength: 64,
      // DEV ONLY
      attestation: {
        // DEV ONLY
        v3:
          'BDxaTgQ9VLl1I3VMdfT+dtLz+/EaEgAoYmn22/PFABpgFPvEh5dst2Ns20YufsofVyDE/Z+eBBBVYOOjEG40dA8=',
        v4:
          'BDxaTgQ9VLl1I3VMdfT+dtLz+/EaEgAoYmn22/PFABpgFPvEh5dst2Ns20YufsofVyDE/Z+eBBBVYOOjEG40dA8=',
      },
    },
  },
  bloomFilter: {
    // One in 100 million badge users
    falsePositiveRate: 0.00000001,
  },
  certs: {
    dtrust: {
      root: ROOT_CA,
      basic: BASIC_CA,
    },
  },
  rate_limits: {
    default_rate_limit_minute: 5,
    default_rate_limit_hour: 10,
    default_rate_limit_day: 50,
    sms_request_post_ratelimit_minute: 7200,
    sms_request_post_ratelimit_hour: 10,
    sms_verify_post_ratelimit_day: 50,
    sms_verify_bulk_post_ratelimit_day: 50,
    sms_request_post_ratelimit_phone_number: 5,
    sms_request_post_ratelimit_fixed_phone_number: 2,
    auth_login_post_ratelimit_minute: 5,
    auth_hd_login_post_ratelimit_minute: 5,
    locations_traces_get_ratelimit_hour: 1000,
    traces_checkin_post_ratelimit_hour: 1000,
    traces_additionaldata_post_ratelimit_hour: 60,
    users_post_ratelimit_hour: 200,
    users_get_ratelimit_hour: 1000,
    users_patch_ratelimit_hour: 1000,
    users_delete_ratelimit_hour: 100,
    usertransfers_post_ratelimit_hour: 15,
    usertransfers_get_ratelimit_hour: 100,
    hd_password_change_post_ratelimit_hour: 15,
    hd_password_renew_patch_ratelimit_hour: 15,
    password_change_post_ratelimit_hour: 15,
    password_forgot_post_ratelimit_hour: 5,
    password_reset_post_ratelimit_hour: 15,
    password_reset_get_ratelimit_hour: 15,
    email_get_ratelimit_hour: 5,
    email_confirm_post_ratelimit_hour: 15,
    locations_private_post_ratelimit_day: 100,
    locations_delete_ratelimit_day: 1000,
    operators_post_ratelimit_day: 10,
    dummy_max_tracings: 10,
    dummy_max_traces: 20,
    tests_redeem_post_ratelimit_minute: 50,
    tests_redeem_delete_ratelimit_minute: 50,
    badges_post_ratelimit_hour: 10,
  },
};
