/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable no-param-reassign */

const BearerStrategy = require('passport-http-bearer');
const database = require('../database');

const bearerStrategy = new BearerStrategy((token, done) => {
  database.BadgeGenerator.findByPk(token)
    .then(badgeGenerator => {
      if (!badgeGenerator) {
        return done(null, false);
      }
      return done(null, badgeGenerator);
    })
    .catch(error => done(null, error));
});

module.exports = bearerStrategy;
