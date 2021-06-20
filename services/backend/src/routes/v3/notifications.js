const router = require('express').Router();
const { getNotifications } = require('../../utils/notifications');

/**
 * Provides hashed trace IDs allowing users to be notified if their data was accessed by a health department.
 * @see https://www.luca-app.de/securityoverview/processes/tracing_find_contacts.html#notifying-guests-about-data-access
 */
router.get('/traces', async (request, response) => {
  const cachedResponse = await getNotifications();
  if (cachedResponse) {
    return response.send(JSON.parse(cachedResponse));
  }
  return response.send([]);
});

module.exports = router;
