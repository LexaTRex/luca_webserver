module.exports = {
  port: 'PORT',
  hostname: 'LUCA_HOSTNAME',
  loglevel: 'LOGLEVEL',
  debug: 'DEBUG',
  e2e: 'E2E',
  skipSmsVerification: 'SKIP_SMS_VERIFICATION',
  cookies: {
    secret: 'COOKIES_SECRET',
  },
  db: {
    host: 'DB_HOSTNAME',
    host_read1: 'DB_HOSTNAME_READ1',
    host_read2: 'DB_HOSTNAME_READ2',
    host_read3: 'DB_HOSTNAME_READ3',
    username: 'DB_USERNAME',
    password: 'DB_PASSWORD',
    database: 'DB_DATABASE',
  },
  redis: {
    hostname: 'REDIS_HOSTNAME',
    password: 'REDIS_PASSWORD',
  },
  mailer: {
    apiUrl: 'MAILER_API_URL',
    apiKey: 'MAILER_API_KEY',
    apiSecret: 'MAILER_API_KEY_SECRET',
  },
  messagemobile: {
    accessKey: 'MM_ACCESS_KEY',
    gateway: 'MM_GATEWAY',
  },
  sinch: {
    cid: 'SINCH_CID',
    password: 'SINCH_PASSWORD',
    gateway1: 'SINCH_GATEWAY1',
    gateway2: 'SINCH_GATEWAY2',
  },
  gtx: {
    authKey: 'GTX_AUTH_KEY',
    gateway: 'GTX_GATEWAY',
  },
  keys: {
    badge: {
      targetKeyId: 'BADGE_TARGET_KEY_ID',
      private: 'BADGE_KEY_PRIVATE',
      attestation: {
        v3: 'BADGE_ATTESTATION_KEY_PUBLIC_V3',
        v4: 'BADGE_ATTESTATION_KEY_PUBLIC_V4',
      },
    },
  },
  proxy: {
    http: 'http_proxy',
    https: 'http_proxy',
  },
};
