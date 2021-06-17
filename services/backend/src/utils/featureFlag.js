const database = require('../database');

const DEFAULT_VALUES = {
  sms_rate_mm: 1,
  sms_rate_sinch: 1,
  dummy_max_tracings: 10,
  dummy_max_traces: 20,
  v4_signed_public_keys: false,
};

const get = async key => {
  const flag = await database.FeatureFlag.findByPk(key);
  if (!flag) return DEFAULT_VALUES[String(key)];
  return JSON.parse(flag.value);
};

module.exports = {
  get,
};
