import {
  validateEmail,
  validatePhoneNumber,
  validateSafeString,
} from './validators.helper';

export const getRequiredRule = (intl, fieldName) => ({
  required: true,
  whitespace: true,
  message: intl.formatMessage({ id: `userManagement.error.${fieldName}` }),
});

export const getPhoneRule = intl => ({
  validator: validatePhoneNumber,
  message: intl.formatMessage({ id: 'userManagement.error.phone.invalid' }),
});

export const getSafeStringRule = (intl, fieldName) => ({
  validator: validateSafeString,
  message: intl.formatMessage({
    id: `userManagement.error.${fieldName}.invalid`,
  }),
});

export const getMaxLengthRule = (intl, max) => ({
  max,
  message: intl.formatMessage({ id: 'error.length' }),
});

export const getEmailRule = intl => ({
  validator: validateEmail,
  message: intl.formatMessage({
    id: 'userManagement.error.emailInvalid',
  }),
});