import { base64ToHex } from '@lucaapp/crypto';
import moment from 'moment';

const API_PATH = '/api';

const headers = {
  'Content-Type': 'application/json',
};

class ApiError extends Error {
  constructor(response) {
    super();
    this.response = response;
    this.status = response.status;
    this.message = `Request to ${response.url} failed with status ${response.status}`;
  }
}

const checkResponse = response => {
  if (!response.ok) {
    throw new ApiError(response);
  }

  return response;
};

const getRequest = path => {
  return fetch(path, {
    method: 'GET',
    headers,
  })
    .then(response => {
      if (response.ok) {
        return response.text();
      }

      throw new ApiError(response);
    })
    .then(payload => {
      try {
        return JSON.parse(payload);
      } catch {
        // This is fine:
        // Payload is just text like "OK"
        return payload;
      }
    });
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
  return getRequest(`${API_PATH}/v3/auth/me`);
};

export const getPrivateKeySecret = () =>
  getRequest(`${API_PATH}/v3/operators/privateKeySecret`).then(data =>
    base64ToHex(data.privateKeySecret)
  );

export const checkEmail = email => {
  return getRequest(`${API_PATH}/v3/operators/email/${email}`);
};

export const requestAccountDeletion = () => {
  return fetch(`${API_PATH}/v3/operators`, {
    method: 'DELETE',
    headers,
  }).then(checkResponse);
};

export const undoAccountDeletion = () => {
  return fetch(`${API_PATH}/v3/operators/restore`, {
    method: 'POST',
    headers,
  }).then(checkResponse);
};

// GROUPS
export const getGroups = () => {
  return getRequest(`${API_PATH}/v3/locationGroups`);
};

export const getGroup = groupId => {
  return getRequest(`${API_PATH}/v3/locationGroups/${groupId}`);
};

export const updateGroup = parameters => {
  return fetch(`${API_PATH}/v3/locationGroups/${parameters.groupId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(parameters.data),
  }).then(checkResponse);
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
  })
    .then(checkResponse)
    .then(response => response.json());
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
  return getRequest(`${API_PATH}/v3/operators/password/reset/${resetId}`);
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
  return getRequest(`${API_PATH}/v3/operators/email/isChangeActive`);
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
  return getRequest(`${API_PATH}/v3/operators/locations/${locationId}`);
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

export const forceCheckoutSingleTrace = traceId => {
  return fetch(`${API_PATH}/v3/traces/checkout`, {
    method: 'POST',
    body: JSON.stringify({
      traceId,
      timestamp: moment().seconds(0).unix(),
    }),
    headers,
  });
};

// COUNTER
export const getCurrentCount = scannerId => {
  return getRequest(
    `${API_PATH}/v3/scanners/${scannerId}/traces/count/current`
  );
};

export const getAllTransfers = () => {
  return getRequest(`${API_PATH}/v3/locationTransfers`);
};

export const getAllUncompletedTransfers = () => {
  return getRequest(`${API_PATH}/v3/locationTransfers/uncompleted`);
};

export const getLocationTransfer = transferId => {
  return getRequest(`${API_PATH}/v3/locationTransfers/${transferId}`);
};

export const shareData = data => {
  return fetch(`${API_PATH}/v3/locationTransfers/${data.locationTransferId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data.traces),
  });
};

export const getAdditionalData = locationId => {
  return getRequest(
    `${API_PATH}/v3/locations/additionalDataSchema/${locationId}`
  );
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
export const getTraces = (accessId, duration) => {
  return getRequest(
    `${API_PATH}/v3/locations/traces/${accessId}/${
      duration ? `?duration=${duration}` : ''
    }`
  );
};

// BADGE
export const getBadgeUser = userId => {
  return getRequest(`${API_PATH}/v3/users/${userId}`);
};

export const updateBadgeUser = (userId, data) => {
  return fetch(`${API_PATH}/v3/users/${userId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
};

export const getBadgeRegistrator = registratorId => {
  return getRequest(`${API_PATH}/v3/badgeRegistrators/${registratorId}`);
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
