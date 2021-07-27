import { isNumeric, isPostalCode } from 'validator/validator.min';
import { isValidCharacter } from './checkCharacter';
import { isValidPhoneNumber } from './checkPhoneNumber';

export const validateNames = (_, value) => {
  if (value?.trim() && !isValidCharacter(value)) {
    return Promise.reject();
  }
  if (value?.trim() && isNumeric(value.replace(/\s/g, ''))) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const validateZipCode = (_, value) => {
  if (value?.trim() && !isPostalCode(value, 'DE')) {
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

export const validateHouseNo = (_, value) => {
  if (value?.trim() && !isValidCharacter(value)) {
    return Promise.reject();
  }
  return Promise.resolve();
};
