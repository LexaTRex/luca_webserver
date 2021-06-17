const ApiError = require('../utils/apiError');
const featureFlag = require('../utils/featureFlag');

const requireEnabledFeature = flag => async (request, response, next) => {
  const isFeatureEnabled = await featureFlag.get(flag);
  if (!isFeatureEnabled) {
    throw new ApiError(ApiError.FEATURE_DISABLED);
  }
  return next();
};

module.exports = {
  requireEnabledFeature,
};
