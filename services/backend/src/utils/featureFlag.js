const database = require('../database');

const DEFAULT_VALUES = {
  sms_rate_mm: 1,
  sms_rate_sinch: 1,
  sms_rate_gtx: 1,
  dummy_max_tracings: 10,
  dummy_max_traces: 20,
  v4_signed_public_keys: false,
  android_minimum_version: 57,
  ios_minimum_version: 24,
  lst_minimum_version: 'v1.0.0',
  enable_level_4_notifications: false,
};

const get = async key => {
  const flag = await database.FeatureFlag.findByPk(key);
  if (!flag) return DEFAULT_VALUES[String(key)];
  return JSON.parse(flag.value);
};

module.exports = {
  get,
};
