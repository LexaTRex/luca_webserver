import { hexToBase64 } from '@lucaapp/crypto';
import { APPLICATION_JSON, CONTENT_TYPE } from 'constants/header';

const API_PATH = '/api/';

const headers = {
  'Content-Type': 'application/json',
};

// TIMESYNC
export const getTimesync = () =>
  fetch(`${API_PATH}v3/timesync`, {
    method: 'GET',
    headers,
  });

// SCANNER

export function getScanner(scannerId) {
  return fetch(`${API_PATH}/v3/scanners/${scannerId}`).then(response =>
    response.json()
  );
}

// USERS
export function createUser(iv, mac, encryptedData, signature, publicKey) {
  return fetch(`${API_PATH}/v3/users`, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
      data: hexToBase64(encryptedData),
      signature: hexToBase64(signature),
      publicKey: hexToBase64(publicKey),
    }),
  }).then(response => response.json());
}

export function checkinTrace(
  scannerId,
  traceId,
  timestamp,
  encryptedCheckinData,
  iv,
  mac,
  publicKey
) {
  return fetch(`${API_PATH}/v3/traces/checkin`, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({
      scannerId,
      traceId: hexToBase64(traceId),
      timestamp,
      data: hexToBase64(encryptedCheckinData),
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
      publicKey: hexToBase64(publicKey),
      deviceType: 3,
    }),
  });
}

export function checkoutTrace(traceId, timestamp) {
  return fetch(`${API_PATH}/v3/traces/checkout`, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({ traceId, timestamp }),
  });
}

export function addAdditionalDataToTrace(
  iv,
  mac,
  traceId,
  encryptedData,
  publicKey
) {
  return fetch(`${API_PATH}/v3/traces/additionalData`, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
      traceId: hexToBase64(traceId),
      data: hexToBase64(encryptedData),
      publicKey: hexToBase64(publicKey),
    }),
  });
}

export function postUserTransfers(keyId, iv, mac, encryptedData, publicKey) {
  return fetch(`${API_PATH}/v3/userTransfers`, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({
      keyId,
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
      data: hexToBase64(encryptedData),
      publicKey: hexToBase64(publicKey),
    }),
  }).then(response => response.json());
}

// SMS
export async function sendSMSTAN(phone) {
  const { challengeId } = await fetch(`${API_PATH}/v3/sms/request`, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({ phone }),
  }).then(response => response.json());
  return challengeId;
}

export async function verifySMSTAN(challengeId, tan) {
  const { status } = await fetch(`${API_PATH}/v3/sms/verify`, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({ challengeId, tan }),
  });

  if (status !== 204) throw Error;
}
