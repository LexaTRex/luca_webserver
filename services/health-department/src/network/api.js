import { base64ToHex } from '@lucaapp/crypto';

const API_PATH = '/api';
const AUTH_PATH = '/v3/auth';

const headers = {
  'Content-Type': 'application/json',
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
  return fetch(`${API_PATH}${AUTH_PATH}/healthDepartmentEmployee/me`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
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
  return fetch(`${API_PATH}/v3/healthDepartments/keys`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getHealthDepartment = departmentId => {
  return fetch(`${API_PATH}/v3/healthDepartments/${departmentId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getPrivateKeySecret = () =>
  fetch(`${API_PATH}/v3/healthDepartments/privateKeySecret`)
    .then(response => response.json())
    .then(data =>
      data && data.privateKeySecret ? base64ToHex(data.privateKeySecret) : null
    );

// TAN
export const getUserTransferByTan = tan => {
  return fetch(`${API_PATH}/v3/userTransfers/tan/${tan}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getUserTransferById = userTransferId => {
  return fetch(`${API_PATH}/v3/userTransfers/${userTransferId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

// PROCESSES
export const getProcesses = () => {
  return fetch(`${API_PATH}/v3/tracingProcesses/`, {
    method: 'GET',
    headers,
  });
};

export const getEncryptedUserContactData = userId => {
  return fetch(`${API_PATH}/v3/users/${userId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getUserTraces = data => {
  return fetch(`${API_PATH}/v3/traces/trace`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(response => response.json());
};

export const toggleCompleted = (tracingProcessId, isCompleted) => {
  return fetch(`${API_PATH}/v3/tracingProcesses/${tracingProcessId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ isCompleted }),
  });
};

export const getLocationTransfers = tracingProcessId => {
  return fetch(
    `${API_PATH}/v3/tracingProcesses/${tracingProcessId}/locationTransfers`,
    {
      method: 'GET',
      headers,
    }
  ).then(async response => {
    const transfers = await response.json();
    const transferPromises = transfers.map(async transfer => {
      const locationTransferResponse = await fetch(
        `${API_PATH}/v3/locations/${transfer.locationId}`,
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
  });
};

export const getContactPersons = transferId => {
  return fetch(`${API_PATH}/v3/locationTransfers/${transferId}/traces`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const contactLocation = transferId => {
  return fetch(`${API_PATH}/v3/locationTransfers/${transferId}/contact`, {
    method: 'POST',
    headers,
  });
};

// SEARCH
export const findGroups = group => {
  return fetch(`${API_PATH}/v3/locationGroups/search/?name=${group}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
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
  return fetch(`${API_PATH}/v3/healthDepartmentEmployees/`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const deleteEmployee = employeeId => {
  return fetch(`${API_PATH}/v3/healthDepartmentEmployees/${employeeId}`, {
    method: 'DELETE',
    headers,
  });
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
  return fetch(`${API_PATH}/v3/keys/daily/current`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getAllDailyKeys = () => {
  return fetch(`${API_PATH}/v3/keys/daily`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getDailyKeyedList = keyId => {
  return fetch(`${API_PATH}/v3/keys/daily/encrypted/${keyId}/keyed`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

// BADGE KEY
export const getBadgeTargetKeyId = () => {
  return fetch(`${API_PATH}/v3/keys/badge/targetKeyId`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getCurrentBadgeKey = () => {
  return fetch(`${API_PATH}/v3/keys/badge/current`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getBadgeKeyedList = keyId => {
  return fetch(`${API_PATH}/v3/keys/badge/encrypted/${keyId}/keyed`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
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
  return fetch(`${API_PATH}/v3/keys/issuers/`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
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
  return fetch(`${API_PATH}/v3/keys/daily/encrypted/${keyId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const getEncryptedBadgePrivateKey = keyId => {
  return fetch(`${API_PATH}/v3/keys/badge/encrypted/${keyId}`, {
    method: 'GET',
    headers,
  }).then(response => response.json());
};

export const createUserTransfer = payload => {
  return fetch(`${API_PATH}/v3/userTransfers`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
  }).then(response => response.json());
};
