export const LUCA_USER_ID_KEY = 'LUCA_USER_ID';
export const LUCA_USER_SECRETS_KEY = 'LUCA_USER_SECRETS';

export const LUCA_USER_TRACEIDS_KEY = 'LUCA_USER_TRACEIDS';
export const LUCA_LOCATION_ID_CHECKIN_KEY = 'LUCA_LOCATION_ID_CHECKIN';
export const LUCA_USER_DATA_KEY = 'LUCA_USER_DATA';
export const LUCA_USER_CHECKIN_TRACEID_KEY = 'LUCA_USER_CHECKIN_TRACEID';

export const LUCA_TIMESTAMP_LAST_CHECKIN_KEY = 'LUCA_TIMESTAMP_LAST_CHECKIN';
export const LUCA_CHECKIN_KEY = 'LUCA_CHECKIN';

export function getUserIdFromLocalStorage() {
  return localStorage.getItem(LUCA_USER_ID_KEY);
}
export function storeUserIdToLocalStorage(userId) {
  return localStorage.setItem(LUCA_USER_ID_KEY, userId);
}

export function storeUserSecretsToLocalStorage(secrets) {
  return localStorage.setItem(LUCA_USER_SECRETS_KEY, JSON.stringify(secrets));
}

export function getUserTraceIds() {
  try {
    return JSON.parse(localStorage.getItem(LUCA_USER_TRACEIDS_KEY));
  } catch {
    return null;
  }
}

export function storeTraceIdToLocalStorage(traceId) {
  let userTraceIds;
  if (!traceId) {
    userTraceIds = [];
  } else {
    userTraceIds = getUserTraceIds();
    userTraceIds.push(traceId);
  }
  return localStorage.setItem(
    LUCA_USER_TRACEIDS_KEY,
    JSON.stringify(userTraceIds)
  );
}

export function storeCheckinTraceIdToLocalStorage(traceId) {
  return localStorage.setItem(LUCA_USER_CHECKIN_TRACEID_KEY, traceId);
}

export function getCheckinTraceIdFromLocalStorage() {
  return localStorage.getItem(LUCA_USER_CHECKIN_TRACEID_KEY);
}

export function getUserSecretsFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem(LUCA_USER_SECRETS_KEY));
  } catch {
    return null;
  }
}

export function storeUserDataToLocalStorage(userData) {
  return localStorage.setItem(LUCA_USER_DATA_KEY, JSON.stringify(userData));
}
export function getUserData() {
  try {
    return JSON.parse(localStorage.getItem(LUCA_USER_DATA_KEY));
  } catch {
    return null;
  }
}

export function getLastCheckinTimestamp() {
  try {
    // eslint-disable-next-line radix
    return Number.parseInt(
      localStorage.getItem(LUCA_TIMESTAMP_LAST_CHECKIN_KEY)
    );
  } catch {
    return null;
  }
}
export function storeLastCheckinTimestamp(timestamp) {
  return localStorage.setItem(LUCA_TIMESTAMP_LAST_CHECKIN_KEY, timestamp);
}

export function storeCheckinLocationIdToLocalStorage(locationId) {
  return localStorage.setItem(LUCA_LOCATION_ID_CHECKIN_KEY, locationId);
}

export function getCheckinLocationIdFromLocalStorage() {
  return localStorage.getItem(LUCA_LOCATION_ID_CHECKIN_KEY);
}

export function resetStorage() {
  localStorage.removeItem(LUCA_USER_ID_KEY);
  localStorage.removeItem(LUCA_USER_DATA_KEY);
  localStorage.removeItem(LUCA_USER_SECRETS_KEY);
  localStorage.removeItem(LUCA_USER_TRACEIDS_KEY);
  localStorage.removeItem(LUCA_USER_CHECKIN_TRACEID_KEY);
  localStorage.removeItem(LUCA_LOCATION_ID_CHECKIN_KEY);
  localStorage.removeItem(LUCA_TIMESTAMP_LAST_CHECKIN_KEY);
}
