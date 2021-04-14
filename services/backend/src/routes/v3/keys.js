const router = require('express').Router();
const dailyRouter = require('./keys/daily');
const badgesRouter = require('./keys/badges');
const issuersRouter = require('./keys/issuers');

router.use('/daily', dailyRouter);
router.use('/badge', badgesRouter);
router.use('/badges', badgesRouter);
router.use('/issuers', issuersRouter);

module.exports = router;
