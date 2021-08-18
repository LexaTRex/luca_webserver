const router = require('express').Router();
const config = require('config');

router.get('/', (request, response) => {
  response.send(config.get('version'));
});

module.exports = router;
