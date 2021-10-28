const config = require('config');
const router = require('express').Router();
const passport = require('passport');

const { requireInternalIp } = require('../middlewares/requireInternalIp');

const metricsRouter = require('./internal/metrics');
const end2EndRouter = require('./internal/end2end');
const jobsRouter = require('./internal/jobs');

router.use(requireInternalIp);
router.use('/metrics', metricsRouter);
router.use(passport.authenticate('bearer-internalAccess', { session: false }));
router.use('/jobs', jobsRouter);

if (config.get('e2e')) {
  router.use('/end2end', end2EndRouter);
}

module.exports = router;
