/* eslint-disable promise/no-callback-in-promise */

const passportCustom = require('passport-custom');
const database = require('../database');

// eslint-disable-next-line consistent-return
const bearerStrategy = new passportCustom.Strategy(async (request, done) => {
  let token = request.headers['internal-access-authorization'];

  if (!token) {
    return done(null, null, new Error('missing token'));
  }

  if (token.startsWith('Bearer')) {
    token = token.split(' ').pop();
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [name, password] = decoded.split(':');
    const internalAccessUser = await database.internalAccessUser.findByPk(name);

    if (!internalAccessUser) return done(null, false);

    const isValidPassword = await internalAccessUser.checkPassword(password);

    if (!isValidPassword) {
      return done(null, false);
    }

    return done(null, internalAccessUser);
  } catch (error) {
    return done(error);
  }
});

module.exports = bearerStrategy;
