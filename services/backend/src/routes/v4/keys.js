const router = require('express').Router();

const issuersRouter = require('./keys/issuers');

router.use('/issuers', issuersRouter);

module.exports = router;
