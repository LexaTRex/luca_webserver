const { promisify } = require('util');

const setTimeoutPromise = promisify(setTimeout);

const sleep = msToSleep => setTimeoutPromise(msToSleep);

module.exports = {
  sleep,
};
