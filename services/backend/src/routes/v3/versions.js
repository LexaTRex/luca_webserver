const router = require('express').Router();

router.get('/apps/android', async (request, response) => {
  return response.send({
    minimumVersion: 48,
  });
});

router.get('/apps/ios', async (request, response) => {
  return response.send({
    minimumVersion: 24,
  });
});

module.exports = router;
