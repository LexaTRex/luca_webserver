/* eslint-disable max-classes-per-file, class-methods-use-this */
const status = require('http-status');

// error definitions
const API_ERRORS = {
  UNKNOWN_API_ERROR: {
    status: status.INTERNAL_SERVER_ERROR,
    message: 'Unknown API error.',
  },
  FEATURE_DISABLED: {
    status: status.NOT_IMPLEMENTED,
    message: 'Feature is disabled.',
  },
  ISSUER_NOT_FOUND: {
    status: status.NOT_FOUND,
    message: 'Issuer not found.',
  },
  HEALTH_DEPARTMENT_NOT_FOUND: {
    status: status.NOT_FOUND,
    message: 'Health department not found.',
  },
  LOCATION_TRANSFER_NOT_FOUND: {
    status: status.NOT_FOUND,
    message: 'Location transfer not found.',
  },
  SIGNED_KEYS_ALREADY_EXIST: {
    status: status.CONFLICT,
    message: 'Signed keys already exist.',
  },
  INVALID_SIGNED_KEYS: {
    status: status.BAD_REQUEST,
    message: 'Invalid signed keys.',
  },
  INVALID_SIGNATURE: {
    status: status.BAD_REQUEST,
    message: 'Signature invalid.',
  },
  FORBIDDEN: {
    status: status.FORBIDDEN,
    message: 'User not authorized to perform this action',
  },
  UNAUTHORIZED: {
    status: status.UNAUTHORIZED,
    message: 'User is not signed in.',
  },
  CHALLENGE_NOT_FOUND: {
    status: status.NOT_FOUND,
    message: 'Challenge does not exist.',
  },
  DEVICE_NOT_FOUND: {
    status: status.NOT_FOUND,
    message: 'Device does not exist.',
  },
  DEVICE_EXPIRED: {
    status: status.LOCKED,
    message: 'Device refresh token has expired.',
  },
  TOO_MANY_LOCATIONS: {
    status: status.REQUEST_ENTITY_TOO_LARGE,
    message: 'There are too many locations attatched to this request',
  },
  USER_TRANSFER_NOT_FOUND: {
    status: status.NOT_FOUND,
    message: 'User transfer not found.',
  },
};

class ApiError extends Error {
  constructor(errorCode = ApiError.UNKNOWN_API_ERROR, message) {
    super(message || API_ERRORS[String(errorCode)].message);
    this.errorCode = errorCode;
    this.statusCode = API_ERRORS[String(errorCode)].status || 500;
  }
}

module.exports = {
  ApiError,
  ApiErrorType: {
    UNKNOWN_API_ERROR: 'UNKNOWN_API_ERROR',
    FEATURE_DISABLED: 'FEATURE_DISABLED',
    ISSUER_NOT_FOUND: 'ISSUER_NOT_FOUND',
    CHALLENGE_NOT_FOUND: 'CHALLENGE_NOT_FOUND',
    HEALTH_DEPARTMENT_NOT_FOUND: 'HEALTH_DEPARTMENT_NOT_FOUND',
    LOCATION_TRANSFER_NOT_FOUND: 'LOCATION_TRANSFER_NOT_FOUND',
    SIGNED_KEYS_ALREADY_EXIST: 'SIGNED_KEYS_ALREADY_EXIST',
    INVALID_SIGNED_KEYS: 'INVALID_SIGNED_KEYS',
    INVALID_SIGNATURE: 'INVALID_SIGNATURE',
    FORBIDDEN: 'FORBIDDEN',
    UNAUTHORIZED: 'UNAUTHORIZED',
    DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
    DEVICE_EXPIRED: 'DEVICE_EXPIRED',
    TOO_MANY_LOCATIONS: 'TOO_MANY_LOCATIONS',
    USER_TRANSFER_NOT_FOUND: 'USER_TRANSFER_NOT_FOUND',
  },
};
