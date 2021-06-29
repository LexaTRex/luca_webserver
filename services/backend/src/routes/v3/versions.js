const router = require('express').Router();
const featureFlag = require('../../utils/featureFlag');

router.get('/apps/android', async (request, response) => {
  return response.send({
    minimumVersion: await featureFlag.get('android_minimum_version'),
  });
});

router.get('/apps/ios', async (request, response) => {
  return response.send({
    minimumVersion: await featureFlag.get('ios_minimum_version'),
  });
});

module.exports = router;
