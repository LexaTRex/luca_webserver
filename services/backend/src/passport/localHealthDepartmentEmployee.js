/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable no-param-reassign */

const LocalStrategy = require('passport-local').Strategy;
const database = require('../database');
const { logEvent } = require('../utils/hdAuditLog');
const { AuditLogEvents, AuditStatusType } = require('../constants/auditLog');
const { UserTypes } = require('../middlewares/requireUser');

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
      logEvent(user, {
        type: AuditLogEvents.LOGIN,
        status: AuditStatusType.ERROR_INVALID_PASSWORD,
      });

      return done(null, false);
    }

    user.type = UserTypes.HD_EMPLOYEE;

    logEvent(user, {
      type: AuditLogEvents.LOGIN,
      status: AuditStatusType.SUCCESS,
    });

    return done(null, user);
  }
);

module.exports = localStrategy;
