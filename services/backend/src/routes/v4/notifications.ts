import { Router } from 'express';
import status from 'http-status';
import {
  getActiveChunk,
  getArchivedChunk,
} from 'utils/notifications/notificationsV4';
import { getNotificationConfig } from 'utils/notifications/notificationsConfig';
import { validateParametersSchema } from 'middlewares/validateSchema';
import { limitRequestsPerHour } from 'middlewares/rateLimit';
import { chunkIdParametersSchema } from './notifications.schemas';

const router = Router();

/**
 * Provides hashed trace IDs allowing users to be notified if their data was accessed by a health department.
 * @see https://www.luca-app.de/securityoverview/processes/tracing_find_contacts.html#notifying-guests-about-data-access
 */
router.get(
  '/traces',
  limitRequestsPerHour(
    'notifications_v4_traces_active_chunk_get_ratelimit_hour'
  ),
  async (request, response) => {
    const notificationChunk = await getActiveChunk();

    if (notificationChunk) {
      return response.send(notificationChunk);
    }
    return response.send(status.NOT_FOUND);
  }
);

router.get(
  '/traces/:chunkId',
  limitRequestsPerHour(
    'notifications_v4_traces_archived_chunk_get_ratelimit_hour'
  ),
  validateParametersSchema(chunkIdParametersSchema),
  async (request, response) => {
    const notificationChunk = await getArchivedChunk(request.params.chunkId);
    if (notificationChunk) {
      return response.send(notificationChunk);
    }
    return response.send(status.NOT_FOUND);
  }
);
router.get(
  '/config',
  limitRequestsPerHour('notifications_v4_config_get_ratelimit_hour'),
  async (request, response) => {
    const notificationConfig = await getNotificationConfig();
    if (notificationConfig) {
      return response.send(notificationConfig);
    }
    return response.send(status.NOT_FOUND);
  }
);

module.exports = router;
