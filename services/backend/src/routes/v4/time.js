const moment = require('moment');
const router = require('express').Router();

// get current server time
router.get('/', (request, response) => {
  return response.send({ unix: moment().unix() });
});

module.exports = router;
