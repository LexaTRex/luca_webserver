import { base64ToHex } from '@lucaapp/crypto';

const API_PATH = '/api';
const AUTH_PATH = '/v3/auth';

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
  return fetch(`${API_PATH}${AUTH_PATH}/healthDepartmentEmployee/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

export const logout = () => {
  return fetch(`${API_PATH}${AUTH_PATH}/logout`, {
    method: 'POST',
    headers,
  });
};

export const getMe = () => {
  return getRequest(`${API_PATH}${AUTH_PATH}/healthDepartmentEmployee/me`);
};

// Health-Department
export const storeKeys = data => {
  return fetch(`${API_PATH}/v3/healthDepartments/keys`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

export const getKeys = () => {
  return getRequest(`${API_PATH}/v3/healthDepartments/keys`);
};

export const getHealthDepartment = departmentId => {
  return getRequest(`${API_PATH}/v4/healthDepartments/${departmentId}`);
};

export const getPrivateKeySecret = () =>
  getRequest(`${API_PATH}/v3/healthDepartments/privateKeySecret`).then(data =>
    data && data.privateKeySecret ? base64ToHex(data.privateKeySecret) : null
  );

// TAN
export const getUserTransferByTan = tan => {
  return getRequest(`${API_PATH}/v3/userTransfers/tan/${tan}`);
};

export const getUserTransferById = userTransferId => {
  return getRequest(`${API_PATH}/v3/userTransfers/${userTransferId}`);
};

// PROCESSES
export const getProcesses = () => {
  return getRequest(`${API_PATH}/v3/tracingProcesses/`);
};

export const getProcess = processId => {
  return getRequest(`${API_PATH}/v3/tracingProcesses/${processId}`);
};

export const getEncryptedUserContactData = userId => {
  return getRequest(`${API_PATH}/v3/users/${userId}`);
};

export const getUserTraces = data => {
  return fetch(`${API_PATH}/v3/traces/trace`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(response => response.json());
};

export const updateProcess = (tracingProcessId, data) => {
  return fetch(`${API_PATH}/v3/tracingProcesses/${tracingProcessId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
};

export const getLocationTransfers = tracingProcessId => {
  return getRequest(
    `${API_PATH}/v3/tracingProcesses/${tracingProcessId}/locationTransfers`
  )
    .then(transfers => {
      const transferPromises = transfers.map(async transfer => {
        const locationTransferResponse = await fetch(
          `${API_PATH}/v3/healthDepartmentEmployees/locations/${transfer.locationId}`,
          {
            method: 'GET',
            headers,
          }
        );

        const locationResponse = await locationTransferResponse.json();

        return {
          ...locationResponse,
          time: transfer.time,
          transferId: transfer.uuid,
          isCompleted: transfer.isCompleted,
          contactedAt: transfer.contactedAt,
        };
      });

      return Promise.all(transferPromises);
    })
    .catch(error => {
      if (error.status === 401) {
        return [];
      }

      throw error;
    });
};

export const getContactPersons = transferId => {
  return getRequest(`${API_PATH}/v3/locationTransfers/${transferId}/traces`);
};

export const contactLocation = transferId => {
  return fetch(`${API_PATH}/v3/locationTransfers/${transferId}/contact`, {
    method: 'POST',
    headers,
  });
};

// SEARCH
export const findGroups = searchParameters => {
  const zipCodeParameter = searchParameters.zipCode
    ? `&zipCode=${searchParameters.zipCode}`
    : '';
  return getRequest(
    `${API_PATH}/v3/locationGroups/search/?name=${searchParameters.group}${zipCodeParameter}&limit=${searchParameters.limit}`
  );
};

export const createLocationTransfer = data => {
  return fetch(`${API_PATH}/v3/locationTransfers/`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  }).then(response => response.json());
};

// USER MANAGEMENT

export const getEmployees = () => {
  return getRequest(`${API_PATH}/v3/healthDepartmentEmployees/`);
};

export const renewEmployeePassword = data => {
  return fetch(`${API_PATH}/v3/healthDepartmentEmployees/password/renew`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers,
  }).then(response => response.json());
};

export const deleteEmployee = employeeId => {
  return fetch(`${API_PATH}/v3/healthDepartmentEmployees/${employeeId}`, {
    method: 'DELETE',
    headers,
  });
};

export const updateEmployee = parameters => {
  return fetch(
    `${API_PATH}/v3/healthDepartmentEmployees/${parameters.employeeId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(parameters.data),
      headers,
    }
  );
};

export const createEmployee = data => {
  return fetch(`${API_PATH}/v3/healthDepartmentEmployees/`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  }).then(response => response.json());
};

export const changePassword = data => {
  return fetch(`${API_PATH}/v3/healthDepartmentEmployees/password/change`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  });
};

// DAILY KEY
export const getCurrentDailyKey = () => {
  return getRequest(`${API_PATH}/v3/keys/daily/current`);
};

export const getAllDailyKeys = () => {
  return getRequest(`${API_PATH}/v3/keys/daily`);
};

export const getDailyKeyedList = keyId => {
  return getRequest(`${API_PATH}/v3/keys/daily/encrypted/${keyId}/keyed`);
};

// BADGE KEY
export const getBadgeTargetKeyId = () => {
  return getRequest(`${API_PATH}/v3/keys/badge/targetKeyId`);
};

export const getCurrentBadgeKey = () => {
  return fetch(`${API_PATH}/v3/keys/badge/current`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getBadgeKeyedList = keyId => {
  return getRequest(`${API_PATH}/v3/keys/badge/encrypted/${keyId}/keyed`);
};

export const sendBadgeKeyRotation = payload => {
  return fetch(`${API_PATH}/v3/keys/badge/rotate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
};

// KEYS
export const getIssuers = () => {
  return getRequest(`${API_PATH}/v3/keys/issuers/`);
};

export const sendDailyKeyRotation = payload => {
  return fetch(`${API_PATH}/v3/keys/daily/rotate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
};

export const sendRekeyDailyKeys = payload => {
  return fetch(`${API_PATH}/v3/keys/daily/rekey`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
};

export const sendRekeyBadgeKeys = payload => {
  return fetch(`${API_PATH}/v3/keys/badge/rekey`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
};

export const getEncryptedDailyPrivateKey = keyId => {
  return getRequest(`${API_PATH}/v3/keys/daily/encrypted/${keyId}`);
};

export const getEncryptedBadgePrivateKey = keyId => {
  return getRequest(`${API_PATH}/v3/keys/badge/encrypted/${keyId}`);
};

export const createUserTransfer = payload => {
  return fetch(`${API_PATH}/v3/userTransfers`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
  }).then(response => response.json());
};
