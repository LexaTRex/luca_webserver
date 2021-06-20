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
    const user = await database.HealthDepartmentEmployee.findOne({
      where: { email: username },
    });

    if (!user) {
      return done(null, false);
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      return done(null, false);
    }

    user.type = 'HealthDepartmentEmployee';
    return done(null, user);
  }
);

module.exports = localStrategy;
