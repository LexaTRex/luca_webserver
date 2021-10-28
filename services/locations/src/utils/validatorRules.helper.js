import validator from 'validator';

import {
  DEFAULT_LOCATION_NAME_DE,
  DEFAULT_LOCATION_NAME_EN,
} from 'constants/locations';

import { isValidPhoneNumber } from './parsePhoneNumber';
import { isValidCharacter, isValidTextCharacter } from './checkCharacter';

export const validateSafeString = (_, value) => {
  if (!isValidCharacter(value?.trim())) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const validateTextSafeString = (_, value) => {
  if (!isValidTextCharacter(value?.split('\n').join(' ').trim())) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const validateNoNumeric = (_, value) => {
  if (value?.trim() && validator.isNumeric(value.replace(/\s/g, ''))) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const validatePhoneNumber = (_, value) => {
  if (value?.trim() && !isValidPhoneNumber(value)) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const validateDefaultName = (_, value) => {
  if (
    value?.toLowerCase().trim() === DEFAULT_LOCATION_NAME_EN ||
    value?.toLowerCase().trim() === DEFAULT_LOCATION_NAME_DE
  ) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const checkExistingLocation = isLocationNameTaken => {
  return () => {
    if (isLocationNameTaken) {
      return Promise.reject();
    }
    return Promise.resolve();
  };
};

export const validateZipCode = (_, value) => {
  if (value?.trim() && !validator.isPostalCode(value, 'DE')) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const validateEmail = (_, value) => {
  if (
    !validator.isEmail(value, {
      allow_display_name: false,
      require_display_name: false,
      allow_utf8_local_part: true,
      require_tld: true,
      allow_ip_domain: false,
      blacklisted_chars: "=',\\\\",
    })
  ) {
    return Promise.reject();
  }
  return Promise.resolve();
};
