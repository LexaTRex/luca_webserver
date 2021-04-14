const router = require('express').Router();

const versionsRouter = require('./v2/versions');

router.use('/versions', versionsRouter);

module.exports = router;
