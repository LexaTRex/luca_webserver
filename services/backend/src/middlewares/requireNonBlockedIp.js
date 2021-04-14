const status = require('http-status');

const { isBlockedIp } = require('../utils/ipChecks');

const requireNonBlockedIp = async (request, response, next) => {
  if (await isBlockedIp(request.ip)) {
    return response.sendStatus(status.FORBIDDEN);
  }
  return next();
};

module.exports = {
  requireNonBlockedIp,
};
