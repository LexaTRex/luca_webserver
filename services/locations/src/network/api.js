import { base64ToHex } from '@lucaapp/crypto';

const API_PATH = '/api';

const headers = {
  'Content-Type': 'application/json',
};

// AUTH
export const login = data => {
  return fetch(`${API_PATH}/v3/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

export const logout = () => {
  return fetch(`${API_PATH}/v3/auth/logout`, {
    method: 'POST',
    headers,
  });
};

export const getMe = () => {
  return fetch(`${API_PATH}/v3/auth/me`, {
    method: 'GET',
    headers,
  });
};

export const getPrivateKeySecret = () =>
  fetch(`${API_PATH}/v3/operators/privateKeySecret`)
    .then(response => response.json())
    .then(data => base64ToHex(data.privateKeySecret));

export const checkEmail = email => {
  return fetch(`${API_PATH}/v3/operators/email/${email}`, {
    method: 'GET',
    headers,
  });
};

// GROUPS
export const getGroups = () => {
  return fetch(`${API_PATH}/v3/locationGroups`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getGroup = groupId => {
  return fetch(`${API_PATH}/v3/locationGroups/${groupId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const updateGroup = parameters => {
  return fetch(`${API_PATH}/v3/locationGroups/${parameters.groupId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(parameters.data),
  });
};

export const deleteGroup = groupId => {
  return fetch(`${API_PATH}/v3/locationGroups/${groupId}`, {
    method: 'DELETE',
    headers,
  });
};

export const createGroup = data => {
  return fetch(`${API_PATH}/v3/locationGroups`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(response => response.json());
};

// OPERATOR
export const registerOperator = data => {
  return fetch(`${API_PATH}/v3/operators`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

export const storePublicKey = data => {
  return fetch(`${API_PATH}/v3/operators/publicKey`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

export const changePassword = data => {
  return fetch(`${API_PATH}/v3/operators/password/change`, {
    method: 'POST',
    body: JSON.stringify(data.data),
    headers,
  });
};

export const forgotPassword = data => {
  return fetch(`${API_PATH}/v3/operators/password/forgot`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  });
};

export const resetPassword = data => {
  return fetch(`${API_PATH}/v3/operators/password/reset`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  });
};

export const getPasswordResetRequest = resetId => {
  return fetch(`${API_PATH}/v3/operators/password/reset/${resetId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const updateOperator = data => {
  return fetch(`${API_PATH}/v3/operators`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers,
  });
};

export const updateEmail = data => {
  return fetch(`${API_PATH}/v3/operators/email`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers,
  });
};

export const isEmailUpdatePending = () => {
  return fetch(`${API_PATH}/v3/operators/email/isChangeActive`, {
    method: 'GET',
    headers,
  });
};

export const confirmEmail = activationId => {
  return fetch(`${API_PATH}/v3/operators/email/confirm`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ activationId }),
  });
};

// LOCATION
export const getLocation = locationId => {
  return fetch(`${API_PATH}/v3/operators/locations/${locationId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getLocations = () => {
  return fetch(`${API_PATH}/v3/operators/locations`, {
    method: 'GET',
    headers,
  });
};

export const activateAccount = data => {
  return fetch(`${API_PATH}/v3/operators/activate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

export const deleteLocation = locationId => {
  return fetch(`${API_PATH}/v3/operators/locations/${locationId}`, {
    method: 'DELETE',
  });
};

export const updateLocation = parameters => {
  return fetch(`${API_PATH}/v3/operators/locations/${parameters.locationId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(parameters.data),
  });
};

export const createLocation = data => {
  return fetch(`${API_PATH}/v3/operators/locations`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(response => response.json());
};

export const forceCheckoutUsers = locationId => {
  return fetch(`${API_PATH}/v3/operators/locations/${locationId}/check-out`, {
    method: 'POST',
    headers,
  });
};

// COUNTER
export const getCurrentCount = scannerId => {
  return fetch(`${API_PATH}/v3/scanners/${scannerId}/traces/count/current`, {
    method: 'GET',
    headers,
  });
};

export const getAllTransfers = () => {
  return fetch(`${API_PATH}/v3/locationTransfers`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getAllUncompletedTransfers = () => {
  return fetch(`${API_PATH}/v3/locationTransfers/uncompleted`, {
    method: 'GET',
    headers,
  });
};

export const getLocationTransfer = transferId => {
  return fetch(`${API_PATH}/v3/locationTransfers/${transferId}`, {
    method: 'GET',
    headers,
  });
};

export const getLocationTransferGroup = transferGroupId => {
  return fetch(`${API_PATH}/v3/locationTransferGroups/${transferGroupId}`, {
    method: 'GET',
    headers,
  });
};

export const shareData = data => {
  return fetch(`${API_PATH}/v3/locationTransfers/${data.locationTransferId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data.traces),
  });
};

export const getAdditionalData = locationId => {
  return fetch(`${API_PATH}/v3/locations/additionalDataSchema/${locationId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const createAdditionalData = (additionalDataId, body = {}) => {
  return fetch(
    `${API_PATH}/v3/locations/additionalDataSchema/${additionalDataId}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }
  ).then(response => response.json());
};

export const updateAdditionalData = (locationId, data) => {
  return fetch(`${API_PATH}/v3/locations/additionalDataSchema/${locationId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
};
export const deleteAdditionalData = additionalDataId => {
  return fetch(
    `${API_PATH}/v3/locations/additionalDataSchema/${additionalDataId}`,
    {
      method: 'DELETE',
      headers,
    }
  );
};

// TRACES
export const getTraces = accessId => {
  return fetch(`${API_PATH}/v3/locations/traces/${accessId}`, {
    method: 'GET',
    headers,
  });
};

// BADGE
export const getBadgeUser = userId => {
  return fetch(`${API_PATH}/v3/users/${userId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const updateBadgeUser = (userId, data) => {
  return fetch(`${API_PATH}/v3/users/${userId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
};

export const getBadgeRegistrator = registratorId => {
  return fetch(`${API_PATH}/v3/badgeRegistrators/${registratorId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

// TAN
export const requestTan = data => {
  return fetch(`${API_PATH}/v3/sms/request`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(response => response.json());
};

export const verifyTan = async data => {
  const { status } = await fetch(`${API_PATH}/v3/sms/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (status !== 204) throw Error;
};
