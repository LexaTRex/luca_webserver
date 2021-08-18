import validator from 'validator';

import { isValidCharacter } from './checkCharacter';
import { isValidPhoneNumber } from './checkPhoneNumber';

export const validateZipCode = value => {
  if (!value || validator.isPostalCode(value, 'DE')) {
    return Promise.resolve();
  }
  return Promise.reject();
};

export const validateSafeString = (_, value) => {
  if (!isValidCharacter(value?.trim())) {
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

export const validateEmail = (_, value) => {
  if (
    value?.trim() &&
    !validator.isEmail(value, {
      allow_display_name: false,
      require_display_name: false,
      allow_utf8_local_part: true,
      require_tld: true,
      allow_ip_domain: false,
      domain_specific_validation: true,
      blacklisted_chars: "=',\\\\",
    })
  ) {
    return Promise.reject();
  }
  return Promise.resolve();
};
