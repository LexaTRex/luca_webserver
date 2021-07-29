const API_PATH = '/api/';

const headers = {
  'Content-Type': 'application/json',
};

const HTTP_GONE = 410;
export class AccountDeletedError extends Error {}

// KEYS
export const getDailyKey = () => {
  return fetch(`${API_PATH}v3/keys/daily/current`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

// LOCATION
export const getForm = async formId => {
  const result = await fetch(`${API_PATH}v3/forms/${formId}`, {
    method: 'GET',
    headers,
  });
  if (result.status === HTTP_GONE) {
    throw new AccountDeletedError();
  }
  return result;
};

// USERS
export const createUser = data => {
  return fetch(`${API_PATH}v3/users`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  }).then(response => response.json());
};

// CHECKIN
export const createCheckinV3 = (formId, data) => {
  return fetch(`${API_PATH}v3/forms/${formId}/traces/checkin`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

export const addCheckinData = data => {
  return fetch(`${API_PATH}v3/traces/additionalData`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

// ADDITIONAL DATA
export const getAdditionalData = locationId => {
  return fetch(`${API_PATH}v3/locations/additionalDataSchema/${locationId}`, {
    method: 'GET',
    headers,
  });
};
