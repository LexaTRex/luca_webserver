/* eslint-disable promise/no-callback-in-promise */

const passportCustom = require('passport-custom');
const database = require('../database');

// eslint-disable-next-line consistent-return
const bearerStrategy = new passportCustom.Strategy((request, done) => {
  let token = request.headers['badge-generator-authorization'];

  if (!token) {
    // passing the error in the first parameter will result in a 500 status code
    // being sent unless additional middleware is added
    return done(null, null, new Error('missing token'));
  }

  if (token.split(' ')[0] === 'Bearer')
    token = token.split(' ').slice(1).join(' ');

  database.BadgeGenerator.findByPk(token)
    .then(badgeGenerator => {
      if (!badgeGenerator) {
        return done(null, false);
      }
      return done(null, badgeGenerator);
    })
    .catch(error => done(error));
});

module.exports = bearerStrategy;
