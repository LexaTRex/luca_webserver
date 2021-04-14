const router = require('express').Router();
const status = require('http-status');
const { state } = require('../../utils/lifecycle');

router.get('/ready', (request, response) => {
  if (state.isShuttingDown) {
    return response.sendStatus(status.SERVICE_UNAVAILABLE);
  }
  return response.sendStatus(status.OK);
});

router.get('/', (request, response) => {
  return response.sendStatus(status.OK);
});

module.exports = router;
