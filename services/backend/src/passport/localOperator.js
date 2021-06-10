/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable no-param-reassign */

const LocalStrategy = require('passport-local').Strategy;
const database = require('../database');

const localStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username, password, done) => {
    const user = await database.Operator.findOne({
      where: { username: username.toLowerCase() },
      paranoid: false, // allow soft-deleted operators
    });

    if (!user) {
      return done({ errorType: 'USER_NOT_FOUND' }, null);
    }

    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      return done({ errorType: 'WRONG_PASSWORD' }, null);
    }
    if (!user.activated) {
      return done({ errorType: 'UNACTIVATED' }, null);
    }
    user.type = 'Operator';
    return done(null, user);
  }
);

module.exports = localStrategy;
