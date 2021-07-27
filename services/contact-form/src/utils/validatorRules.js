import {
  validateHouseNo,
  validateNames,
  validatePhoneNumber,
  validateZipCode,
} from './validatorRules.helper';

export const getRequiredRule = intl => ({
  required: true,
  whitespace: true,
  message: intl.formatMessage({
    id: 'contactDataForm.isRequired',
  }),
});

export const getNamesRule = (intl, message) => ({
  validator: validateNames,
  message: intl.formatMessage(message),
});

export const getZipCodeRule = (intl, message) => ({
  validator: validateZipCode,
  message: intl.formatMessage(message),
});

export const getPhoneRule = (intl, message) => ({
  validator: validatePhoneNumber,
  message: intl.formatMessage(message),
});

export const getEmailRule = (intl, message) => ({
  type: 'email',
  message: intl.formatMessage(message),
});

export const getHouseNoRule = (intl, message) => ({
  validator: validateHouseNo,
  message: intl.formatMessage(message),
});

export const getTableNoRule = (intl, message) => ({
  type: 'number',
  message: intl.formatMessage(message),
});

export const getMaxLengthRule = (intl, max) => ({
  max,
  message: intl.formatMessage({ id: 'contactDataForm.invalid.length' }),
});
