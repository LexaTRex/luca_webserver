const router = require('express').Router();

const metrics = require('../../utils/metrics');

router.get('/', async (request, response) => {
  response.type('text/plain');
  response.send(metrics.client.register.metrics());
});

module.exports = router;
