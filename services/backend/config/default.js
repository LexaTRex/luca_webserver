const moment = require('moment');

module.exports = {
  debug: true,
  loglevel: 'debug',
  hostname: 'localhost',
  port: 8080,
  cookies: {
    // DEV ONLY TOKEN
    secret: 'NJrbMwHlI2uILDVkN0w6Aw==',
    maxAge: moment.duration(15, 'minutes').as('ms'),
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
  mailjet: {
    secretKey: '',
    apiKey: '',
    token: '',
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
  luca: {
    traces: {
      maximumRequestablePeriod: moment.duration(24, 'hours').as('hours'),
      maxAge: moment.duration(28, 'days').as('hours'),
      maxDuration: moment.duration(24, 'hours').as('hours'),
    },
    smsChallenges: {
      maxAge: moment.duration(45, 'days').as('hours'),
    },
    userTransfers: {
      maxAge: moment.duration(1, 'hours').as('hours'),
    },
    locationTransferTraces: {
      maxAge: moment.duration(28, 'days').as('hours'),
    },
    locations: {
      maxAge: moment.duration(28, 'days').as('hours'),
    },
  },
  emails: {
    expiry: moment.duration(24, 'hours').as('hours'),
  },
  keys: {
    daily: {
      max: 28,
      minKeyAge: moment.duration(24, 'hours').as('hours'),
    },
    badge: {
      targetKeyId: 1,
      // DEV ONLY KEYPAIR
      public:
        'BDxaTgQ9VLl1I3VMdfT+dtLz+/EaEgAoYmn22/PFABpgFPvEh5dst2Ns20YufsofVyDE/Z+eBBBVYOOjEG40dA8=',
      private: 'qzbym5WwwkbSQ9BJvIdGZIjdh9p72HwQseZXbDs+AbU=',
    },
  },
  proxy: {
    http: null,
    https: null,
  },
};
