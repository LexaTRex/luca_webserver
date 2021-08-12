import validator from 'validator';
import { isValidCharacter } from './checkCharacter';
import { checkPhoneNumber } from './parsePhoneNumber';

export const validateAllowedCharacters = (_, value) => {
  if (value?.trim() && !isValidCharacter(value)) {
    return Promise.reject();
  }
  if (value?.trim() && validator.isNumeric(value.replace(/\s/g, ''))) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const validateHouseNumber = (_, value) => {
  if (value?.trim() && !isValidCharacter(value)) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export function validateZipCode(_, value) {
  if (value?.trim() && !validator.isPostalCode(value, 'any')) {
    return Promise.reject();
  }
  return Promise.resolve();
}

export function validatePhoneNumber(_, value) {
  if (checkPhoneNumber(value)) {
    return Promise.resolve();
  }

  return Promise.reject();
}
