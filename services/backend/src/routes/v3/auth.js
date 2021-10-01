const router = require('express').Router();
const status = require('http-status');
const passport = require('passport');
const moment = require('moment');

const { AuditLogEvents, AuditStatusType } = require('../../constants/auditLog');

const { validateSchema } = require('../../middlewares/validateSchema');
const { restrictOrigin } = require('../../middlewares/restrictOrigin');
const {
  requireOperator,
  requireHealthDepartmentEmployee,
  isUserOfType,
  UserTypes,
} = require('../../middlewares/requireUser');

const { limitRequestsPerMinute } = require('../../middlewares/rateLimit');

const { logEvent } = require('../../utils/hdAuditLog');

const { authSchema } = require('./auth.schemas');

router.post(
  '/login',
  limitRequestsPerMinute('auth_login_post_ratelimit_minute', {
    skipSuccessfulRequests: true,
  }),
  restrictOrigin,
  validateSchema(authSchema),
  (request, response) =>
    passport.authenticate('local-operator', {}, (error, user) => {
      if (error || !user) {
        if (error.errorType === 'UNACTIVATED') {
          return response.sendStatus(status.LOCKED);
        }

        return response.sendStatus(status.UNAUTHORIZED);
      }

      return request.logIn(user, loginError => {
        if (loginError) {
          return response.sendStatus(status.UNAUTHORIZED);
        }
        return response.sendStatus(status.OK);
      });
    })(request, response)
);

// Certificate check is done in Load Balancer
router.post(
  '/healthDepartmentEmployee/login',
  limitRequestsPerMinute('auth_hd_login_post_ratelimit_minute', {
    skipSuccessfulRequests: true,
  }),
  restrictOrigin,
  validateSchema(authSchema),
  passport.authenticate('local-healthDepartmentEmployee'),
  (request, response) => {
    response.sendStatus(status.OK);
  }
);

router.get(
  '/healthDepartmentEmployee/me',
  requireHealthDepartmentEmployee,
  (request, response) => {
    return response.send({
      employeeId: request.user.uuid,
      firstName: request.user.firstName,
      lastName: request.user.lastName,
      email: request.user.email,
      departmentId: request.user.departmentId,
      isAdmin: request.user.isAdmin,
      isSigned: !!request.user.HealthDepartment.signedPublicHDSKP,
      notificationsEnabled: request.user.HealthDepartment.notificationsEnabled,
    });
  }
);

router.post('/logout', restrictOrigin, (request, response) => {
  const { user, logout, session } = request;
  const isHDUser = isUserOfType(UserTypes.HD_EMPLOYEE, request);

  logout();
  session.destroy(error => {
    if (error) {
      if (isHDUser) {
        logEvent(user, {
          type: AuditLogEvents.LOGOUT,
          status: AuditStatusType.ERROR_UNKNOWN_SERVER_ERROR,
        });
      }

      throw error;
    }

    if (isHDUser) {
      logEvent(user, {
        type: AuditLogEvents.LOGOUT,
        status: AuditStatusType.SUCCESS,
      });
    }

    response.clearCookie('connect.sid');
    response.sendStatus(status.NO_CONTENT);
  });
});

router.get('/me', requireOperator, (request, response) => {
  const payload = {
    operatorId: request.user.uuid,
    username: request.user.username,
    firstName: request.user.firstName,
    lastName: request.user.lastName,
    publicKey: request.user.publicKey,
    supportCode: request.user.supportCode,
    email: request.user.email,
    avvAccepted: request.user.avvAccepted,
    lastVersionSeen: request.user.lastVersionSeen,
    allowOperatorDevices: request.user.allowOperatorDevices,
    deletedAt: request.user.deletedAt && moment(request.user.deletedAt).unix(),
    isTrusted: request.user.isTrusted,
  };
  return response.send(payload);
});

module.exports = router;
