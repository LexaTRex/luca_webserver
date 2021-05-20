const status = require('http-status');

const { isBlockedIp, isAllowedIp } = require('../utils/ipChecks');

const requireNonBlockedIp = async (request, response, next) => {
  const isBlocked = await isBlockedIp(request.ip);
  if (!isBlocked) {
    return next();
  }
  if (await isAllowedIp(request.ip)) {
    return next();
  }
  return response
    .status(status.FORBIDDEN)
    .send(
      'Your IP address is blocked. Please contact hello@luca-app.de if you believe this is a mistake.'
    );
};

module.exports = {
  requireNonBlockedIp,
};
