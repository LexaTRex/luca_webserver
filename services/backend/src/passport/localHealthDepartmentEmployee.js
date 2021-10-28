/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable no-param-reassign */

import { UserType } from 'constants/user';

const LocalStrategy = require('passport-local').Strategy;
const database = require('../database');
const { logEvent } = require('../utils/hdAuditLog');
const { AuditLogEvents, AuditStatusType } = require('../constants/auditLog');

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

    user.type = UserType.HEALTH_DEPARTMENT_EMPLOYEE;

    logEvent(user, {
      type: AuditLogEvents.LOGIN,
      status: AuditStatusType.SUCCESS,
    });

    await database.Session.destroy({
      where: { userId: user.uuid, type: UserType.HEALTH_DEPARTMENT_EMPLOYEE },
    });

    return done(null, user);
  }
);

module.exports = localStrategy;
