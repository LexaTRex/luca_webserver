const router = require('express').Router();
const { getNotifications } = require('../../utils/notifications');

// get hashed traceIds of traced traces
router.get('/traces', async (request, response) => {
  const cachedResponse = await getNotifications();
  if (cachedResponse) {
    return response.send(JSON.parse(cachedResponse));
  }
  return response.send([]);
});

module.exports = router;
