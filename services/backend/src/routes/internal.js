const router = require('express').Router();
const { requireInternalIp } = require('../middlewares/requireInternalIp');

const metricsRouter = require('./internal/metrics');
const jobsRouter = require('./internal/jobs');

router.use(requireInternalIp);
router.use('/metrics', metricsRouter);
router.use('/jobs', jobsRouter);

module.exports = router;
