const router = require('express').Router();
const status = require('http-status');
const passport = require('passport');

const { validateSchema } = require('../../middlewares/validateSchema');
const { restrictOrigin } = require('../../middlewares/restrictOrigin');
const { limitRequestsPerMinute } = require('../../middlewares/rateLimit');

const { authSchema } = require('./auth.schemas');

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
  request.logout();
  request.session.destroy(error => {
    if (error) {
      throw error;
    }
    response.clearCookie('connect.sid');
    response.sendStatus(status.NO_CONTENT);
  });
});

module.exports = router;
