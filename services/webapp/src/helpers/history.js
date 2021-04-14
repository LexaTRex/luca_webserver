import moment from 'moment';

import {
  hexToBase64,
  HMAC_SHA256,
  int32ToHex,
  uuidToHex,
} from '@lucaapp/crypto';
import { API_PATH } from 'constants/environment';
import { indexDB, USER_ID, USER_TRACING_SECRET } from 'db';
import { APPLICATION_JSON, CONTENT_TYPE } from 'constants/header';

import { getSecrets } from './crypto';

export async function checkHistory(checks = 360) {
  try {
    const secrets = await getSecrets();
    const userId = secrets[USER_ID];
    const userTracingSecret = secrets[USER_TRACING_SECRET];
    const timestamp = moment().seconds(0);
    const traceIds = [];
    for (let minute = 0; minute < checks; minute += 1) {
      const traceId = HMAC_SHA256(
        `${uuidToHex(userId)}${int32ToHex(timestamp.unix())}`,
        userTracingSecret
      ).slice(0, 32);

      traceIds.push(hexToBase64(traceId));
      timestamp.subtract(1, 'minute');
    }

    return await fetch(`${API_PATH}/v3/traces/bulk`, {
      method: 'POST',
      headers: {
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      body: JSON.stringify({ traceIds }),
    }).then(response => response.json());
  } catch {
    return null;
  }
}

export async function syncHistory(session) {
  const [historyEntry] = await indexDB.history
    .where({ traceId: session.traceId })
    .toArray();

  if (!historyEntry) {
    await indexDB.history.add({
      traceId: session.traceId,
      checkin: session.checkin,
      checkout: session.checkout,
      locationId: session.locationId,
    });

    return {
      ...session,
    };
  }

  await indexDB.history.where({ traceId: session.traceId }).modify({
    checkin: session.checkin,
    checkout: session.checkout,
    locationId: session.locationId,
  });

  return {
    ...historyEntry,
    ...session,
  };
}

export async function checkSession(traceId) {
  const sessions = await fetch(`${API_PATH}/v3/traces/bulk`, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({ traceIds: [traceId] }),
  }).then(response => response.json());
  return sessions[0];
}

export async function getSession(traceId) {
  const [historyEntry] = await indexDB.history.where({ traceId }).toArray();
  if (!historyEntry) {
    const session = await checkSession(traceId);
    if (!session) return null;

    await indexDB.history.add({
      traceId: session.traceId,
      checkin: session.checkin,
      checkout: session.checkout,
      locationId: session.locationId,
    });
    return session;
  }

  return historyEntry;
}

export async function checkLocalHistory() {
  // HISTORY CHECK
  const notClosedHistory = await indexDB.history
    .filter(historyEntry => historyEntry.checkout === null)
    .toArray();
  let notClosedSession = null;

  if (notClosedHistory.length > 0) {
    const historyChecks = await fetch(`${API_PATH}/v3/traces/bulk`, {
      method: 'POST',
      headers: {
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      body: JSON.stringify({
        traceIds: notClosedHistory.map(historyEntry => historyEntry.traceId),
      }),
    }).then(response => response.json());

    for (const historyCheck of historyChecks) {
      if (historyCheck.checkout) {
        indexDB.history.where({ traceId: historyCheck.traceId }).modify({
          checkout: historyCheck.checkout,
        });
      } else {
        notClosedSession = historyCheck;
      }
    }
  }

  return notClosedSession;
}
