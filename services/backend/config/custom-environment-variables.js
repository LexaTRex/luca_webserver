module.exports = {
  port: 'PORT',
  hostname: 'LUCA_HOSTNAME',
  loglevel: 'LOGLEVEL',
  debug: 'DEBUG',
  e2e: 'E2E',
  skipSmsVerification: 'SKIP_SMS_VERIFICATION',
  tz: 'TZ',
  cookies: {
    secret: 'COOKIES_SECRET',
    name: 'COOKIE_NAME',
    path: 'COOKIE_PATH',
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
    database: 'REDIS_DATABASE',
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
      keyLength: 'BADGE_GENERATOR_KEY_LENGTH',
      attestation: {
        v3: 'BADGE_ATTESTATION_KEY_PUBLIC_V3',
        v4: 'BADGE_ATTESTATION_KEY_PUBLIC_V4',
      },
    },
    operatorDevice: {
      publicKey: 'OPERATOR_DEVICE_PUBLIC_KEY',
      privateKey: 'OPERATOR_DEVICE_PRIVATE_KEY',
    },
  },
  luca: {
    alerts: {
      receiverEmail: 'ALERTS_MAILING_RECEIVER',
    },
  },
  proxy: {
    http: 'http_proxy',
    https: 'http_proxy',
  },
  blockListSources: {
    netset: 'DENY_LIST_NETSET_URLS',
    singleCSV: 'DENY_LIST_SINGLE_IP_CSV_URLS',
    doubleCSV: 'DENY_LIST_DOUBLE_IP_CSV_URLS',
  },
  certs: {
    dtrust: {
      root: 'DTRUST_ROOT_CA',
      basic: 'DTRUST_BASIC_CA',
    },
  },
  rate_limits: {
    default_rate_limit_minute: 'DEFAULT_RATE_LIMIT_MINUTE',
    default_rate_limit_hour: 'DEFAULT_RATE_LIMIT_HOUR',
    default_rate_limit_day: 'DEFAULT_RATE_LIMIT_DAY',
    sms_request_post_ratelimit_minute: 'SMS_REQUEST_POST_RATELIMIT_MINUTE',
    sms_request_post_ratelimit_hour: 'SMS_REQUEST_POST_RATELIMIT_HOUR',
    sms_verify_post_ratelimit_day: 'SMS_VERIFY_POST_RATELIMIT_DAY',
    sms_verify_bulk_post_ratelimit_day: 'SMS_VERIFY_BULK_POST_RATELIMIT_DAY',
    sms_request_post_ratelimit_phone_number:
      'SMS_REQUEST_POST_RATELIMIT_PHONE_NUMBER',
    sms_request_post_ratelimit_fixed_phone_number:
      'SMS_REQUEST_POST_RATELIMIT_FIXEDPHONE_NUMBER',
    auth_login_post_ratelimit_minute: 'AUTH_LOGIN_POST_RATELIMIT_MINUTE',
    auth_hd_login_post_ratelimit_minute:
      'AUTH_HEALTHDP_LOGIN_POST_RATELIMIT_MINUTE',
    locations_traces_get_ratelimit_hour: 'LOCATIONS_TRACES_GET_RATELIMIT_HOUR',
    traces_checkin_post_ratelimit_hour: 'TRACES_CHECKIN_POST_RATELIMIT_HOUR',
    traces_additionaldata_post_ratelimit_hour:
      'TRACES_ADDITIONALDATA_POST_RATELIMIT_HOUR',
    users_post_ratelimit_hour: 'USERS_POST_RATELIMIT_HOUR',
    users_get_ratelimit_hour: 'USERS_GET_RATELIMIT_HOUR',
    users_patch_ratelimit_hour: 'USERS_PATCH_RATELIMIT_HOUR',
    users_delete_ratelimit_hour: 'USERS_DELETE_RATELIMIT_HOUR',
    usertransfers_post_ratelimit_hour: 'USERTRANSFER_POST_RATELIMIT_HOUR',
    usertransfers_get_ratelimit_hour: 'USERTRANSFERS_GET_RATELIMIT_HOUR',
    usertransfers_get_user_ratelimit_hour:
      'USERTRANSFERS_GET_USER_RATELIMIT_HOUR',
    hd_password_change_post_ratelimit_hour:
      'HD_PASSWORD_CHANGE_POST_RATELIMIT_HOUR',
    hd_password_renew_patch_ratelimit_hour:
      'HD_PASSWORD_RENEW_PATCH_RATELIMIT_HOUR',
    hd_employee_post_ratelimit_hour: 'HD_EMPLOYEE_POST_RATELIMIT_HOUR',
    password_change_post_ratelimit_hour: 'PASSWORD_CHANGE_POST_RATELIMIT_HOUR',
    password_forgot_post_ratelimit_hour: 'PASSWORD_FORGOT_POST_RATELIMIT_HOUR',
    password_reset_post_ratelimit_hour: 'PASSWORD_RESET_POST_RATELIMIT_HOUR',
    password_reset_get_ratelimit_hour: 'PASSWORD_RESET_GET_RATELIMIT_HOUR',
    locations_private_post_ratelimit_day:
      'LOCATIONS_PRIVATE_POST_RATELIMIT_DAY',
    locations_delete_ratelimit_day: 'LOCATIONS_DELETE_RATELIMIT_DAY',
    locationgroup_post_ratelimit_day: 'LOCATIONGROUP_POST_RATELIMIT_DAY',
    operators_post_ratelimit_day: 'OPERATORS_POST_RATELIMIT_DAY',
    operators_support_email_post_ratelimit_day:
      'OPERATORS_SUPPORT_MAIL_POSTRATELIMIT_DAY',
    hd_support_email_post_ratelimit_day:
      'HEALTH_DEPARTMENT_SUPPORT_MAIL_POSTRATELIMIT_DAY',
    dummy_max_tracings: 'DUMMY_MAX_TRACINGS',
    dummy_max_traces: 'DUMMY_MAX_TRACES',
    badges_post_ratelimit_hour: 'BADGES_POST_RATELIMIT_HOUR',
    badges_bloomfilter_get_ratelimit_hour:
      'BADGES_BLOOMFILTER_GET_RATELIMIT_HOUR',
    operator_email_confirm_post_ratelimit_hour:
      'OPERATOR_EMAIL_CONFIRM_POST_RATELIMIT_HOUR',
    operator_email_patch_ratelimit_day: 'OPERATOR_EMAIL_PATCH_RATELIMIT_DAY',
    operator_email_patch_user_ratelimit_day:
      'OPERATOR_EMAIL_PATCH_USER_RATELIMIT_DAY',
    operator_email_get_ratelimit_day: 'OPERATOR_EMAIL_GET_RATELIMIT_DAY',
    operator_location_post_ratelimit_day:
      'OPERATOR_LOCATION_POST_RATELIMIT_DAY',
    keys_daily_rotate_post_ratelimit_hour:
      'KEYS_DAILY_ROTATE_POST_RATELIMIT_HOUR',
    keys_daily_rotate_post_user_ratelimit_day:
      'KEYS_DAILY_ROTATE_POST_USER_RATELIMIT_DAY',
    keys_daily_rotate_post_ratelimit_day:
      'KEYS_DAILY_ROTATE_POST_RATELIMIT_DAY',
    location_transfer_post_ratelimit_hour:
      'LOCATION_TRANSFER_POST_RATELIMIT_HOUR',
    notifications_traces_get_ratelimit_hour:
      'NOTIFICATIONS_TRACES_GET_RATELIMIT_HOUR',
    notifications_v4_traces_active_chunk_get_ratelimit_hour:
      'NOTIFICATIONS_V4_TRACES_ACTIVE_CHUNK_GET_RATELIMIT_HOUR',
    notifications_v4_traces_archived_chunk_get_ratelimit_hour:
      'NOTIFICATIONS_V4_TRACES_ARCHIVED_CHUNK_GET_RATELIMIT_HOUR',
    notifications_v4_config_get_ratelimit_hour:
      'NOTIFICATIONS_V4_CONFIG_GET_RATELIMIT_HOUR',
    keys_alert_ratelimit_hour: 'KEYS_ALERT_RATELIMIT_HOUR',
    audit_log_event_download_traces_ratelimit_hour:
      'AUDIT_LOG_EVENT_DOWNLOAD_TRACES_RATELIMIT_HOUR',
    audit_log_event_export_traces_ratelimit_hour:
      'AUDIT_LOG_EVENT_EXPORT_TRACES_RATELIMIT_HOUR',
    audit_log_download_ratelimit_hour: 'AUDIT_LOG_DOWNLOAD_RATELIMIT_HOUR',
    audit_log_download_ratelimit_user_hour:
      'AUDIT_LOG_DOWNLOAD_RATELIMIT_USER_HOUR',
    audit_log_download_ratelimit_minute: 'AUDIT_LOG_DOWNLOAD_RATELIMIT_MINUTE',
    audit_log_download_ratelimit_user_minute:
      'AUDIT_LOG_DOWNLOAD_RATELIMIT_USER_MINUTE',
  },
};
