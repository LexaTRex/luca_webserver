const router = require('express').Router();

// eslint-disable-next-line node/no-missing-require, import/no-unresolved, node/no-unpublished-require
const version = require('../../version.json');

router.get('/', (request, response) => {
  response.send(version);
});
module.exports = router;
