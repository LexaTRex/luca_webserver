/* eslint-disable promise/no-callback-in-promise */

const passportCustom = require('passport-custom');
const database = require('../database');

// eslint-disable-next-line consistent-return
const bearerStrategy = new passportCustom.Strategy(async (request, done) => {
  let token = request.headers['badge-generator-authorization'];

  if (!token) {
    // passing the error in the first parameter will result in a 500 status code
    // being sent unless additional middleware is added
    return done(null, null, new Error('missing token'));
  }

  if (token.split(' ')[0] === 'Bearer')
    token = token.split(' ').slice(1).join(' ');

  try {
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [name, password] = decoded.split(':');
    const badgeGenerator = await database.BadgeGenerator.findByPk(name);

    if (!badgeGenerator) return done(null, false);

    const isValidPassword = await badgeGenerator.checkPassword(password);

    if (!isValidPassword) {
      return done(null, false);
    }

    return done(null, badgeGenerator);
  } catch (error) {
    return done(error);
  }
});

module.exports = bearerStrategy;
