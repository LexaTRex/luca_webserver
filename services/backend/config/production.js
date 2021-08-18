const version = require('../version.json');

module.exports = {
  e2e: false,
  debug: false,
  skipSmsVerification: false,
  loglevel: 'info',
  hostname: 'app.luca-app.de',
  shutdownDelay: 15,
  version,
};
