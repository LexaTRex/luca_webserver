const API_PATH = '/api/';

const headers = {
  'Content-Type': 'application/json',
};

// LOCATION
export const getScanner = scannerAccessId => {
  return fetch(`${API_PATH}v3/scanners/access/${scannerAccessId}`, {
    method: 'GET',
    headers,
  });
};

// CHECK-IN
export const createCheckinV3 = data => {
  return fetch(`${API_PATH}v3/traces/checkin`, {
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

export const addCheckinData = data => {
  return fetch(`${API_PATH}v3/traces/additionalData`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

// COUNTER
export const getCurrentCount = scannerAccessId => {
  return fetch(
    `${API_PATH}v3/scanners/${scannerAccessId}/traces/count/current`,
    {
      method: 'GET',
      headers,
    }
  );
};

export const getTotalCount = scannerAccessId => {
  return fetch(`${API_PATH}v3/scanners/${scannerAccessId}/traces/count/total`, {
    method: 'GET',
    headers,
  });
};

// TIMESYNC
export const getTimesync = () =>
  fetch(`${API_PATH}v3/timesync`, {
    method: 'GET',
    headers,
  });
