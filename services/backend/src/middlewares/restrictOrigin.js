const status = require('http-status');

const removePortForLocalhost = origin => {
  if (!origin || !origin.includes('localhost')) return origin;
  return origin.replace(/:\d+/, '');
};

const restrictOrigin = (request, response, next) => {
  const matchingOrigin =
    removePortForLocalhost(request.headers.origin) ===
    `https://${request.headers.host}`;

  if (!matchingOrigin) {
    return response.sendStatus(status.UNAUTHORIZED);
  }
  return next();
};

module.exports = {
  restrictOrigin,
};
