const router = require('express').Router();
const status = require('http-status');
const passport = require('passport');
const moment = require('moment');
const config = require('config');
const jwt = require('jsonwebtoken');

const database = require('../../database/models');
const { logEvent } = require('../../utils/hdAuditLog');
const { handle500 } = require('../../middlewares/error');
const { ApiError, ApiErrorType } = require('../../utils/apiError');
const { validateSchema } = require('../../middlewares/validateSchema');
const { restrictOrigin } = require('../../middlewares/restrictOrigin');
const { limitRequestsPerMinute } = require('../../middlewares/rateLimit');
const { AuditLogEvents, AuditStatusType } = require('../../constants/auditLog');
const {
  UserTypes,
  isUserOfType,
  requireOperatorDevice,
} = require('../../middlewares/requireUser');

const { getOperatorDeviceDTO } = require('./operatorDevices.helper');
const { authSchema, authOperatorDeviceSchema } = require('./auth.schemas');

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

router.get(
  '/operatorDevice/me',
  requireOperatorDevice,
  async (request, response) => {
    return response.send({
      ...getOperatorDeviceDTO(request.user.device),
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
      deletedAt:
        request.user.deletedAt && moment(request.user.deletedAt).unix(),
      isTrusted: request.user.isTrusted,
    });
  }
);

router.post(
  '/operatorDevice/login',
  validateSchema(authOperatorDeviceSchema),
  (request, response) => {
    return passport.authenticate(
      'jwt-operatorDevice',
      { session: false },
      async (error, user) => {
        try {
          if (error) {
            if (error.errorType === 'DEVICE_EXPIRED') {
              throw new ApiError(ApiErrorType.DEVICE_EXPIRED);
            }

            throw new ApiError(ApiErrorType.UNAUTHORIZED);
          }

          if (!user) {
            throw new ApiError(ApiErrorType.UNAUTHORIZED);
          }

          if (!user.activated) {
            throw new ApiError(ApiErrorType.FORBIDDEN);
          }

          await database.OperatorDevice.update(
            {
              reactivatedAt: null,
              refreshedAt: moment(),
            },
            { where: { uuid: user.deviceId } }
          );

          const refreshToken = jwt.sign(
            { deviceId: user.deviceId },
            config.get('keys.operatorDevice.privateKey'),
            {
              algorithm: 'ES256',
              expiresIn: config.get('keys.operatorDevice.expire'),
            }
          );

          request.logIn(user, loginError => {
            if (loginError) {
              throw new ApiError(ApiErrorType.UNAUTHORIZED);
            }
            return response.send({ refreshToken });
          });
        } catch (authorizationError) {
          handle500(authorizationError, request, response);
        }
      }
    )(request, response);
  }
);

router.post(
  '/operatorDevice/logout',
  requireOperatorDevice,
  async (request, response) => {
    await request.user.device.destroy();
    request.logout();
    response.clearCookie('connect.sid');
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
