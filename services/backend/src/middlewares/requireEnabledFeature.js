const { ApiError, ApiErrorType } = require('../utils/apiError');
const featureFlag = require('../utils/featureFlag');

const requireEnabledFeature = flag => async (request, response, next) => {
  const isFeatureEnabled = await featureFlag.get(flag);
  if (!isFeatureEnabled) {
    throw new ApiError(ApiErrorType.FEATURE_DISABLED);
  }
  return next();
};

const requireOperatorDeviceEnabled = async (request, response, next) => {
  if (!request.user.allowOperatorDevices) {
    throw new ApiError(ApiErrorType.FEATURE_DISABLED);
  }

  return next();
};

module.exports = {
  requireEnabledFeature,
  requireOperatorDeviceEnabled,
};
