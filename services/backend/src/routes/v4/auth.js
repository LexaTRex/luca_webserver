const router = require('express').Router();
const status = require('http-status');
const passport = require('passport');

const { validateSchema } = require('../../middlewares/validateSchema');
const { restrictOrigin } = require('../../middlewares/restrictOrigin');
const { limitRequestsPerMinute } = require('../../middlewares/rateLimit');

const { authSchema } = require('./auth.schemas');
const { AuditLogEvents, AuditStatusType } = require('../../constants/auditLog');
const { logEvent } = require('../../utils/hdAuditLog');
const { isUserOfType, UserTypes } = require('../../middlewares/requireUser');

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
    response.sendStatus(status.NO_CONTENT);
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

module.exports = router;
