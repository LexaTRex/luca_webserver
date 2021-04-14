const status = require('http-status');

const restrictOrigin = (request, response, next) => {
  const matchingOrigin =
    request.headers.origin === `https://${request.headers.host}`;

  if (!matchingOrigin) {
    return response.sendStatus(status.UNAUTHORIZED);
  }
  return next();
};

module.exports = {
  restrictOrigin,
};
