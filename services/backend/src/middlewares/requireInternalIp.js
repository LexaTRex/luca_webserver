const status = require('http-status');

const { isInternalIp } = require('../utils/ipChecks');

const requireInternalIp = (request, response, next) => {
  if (!isInternalIp(request.ip)) {
    return response.sendStatus(status.FORBIDDEN);
  }
  return next();
};

module.exports = {
  requireInternalIp,
};
