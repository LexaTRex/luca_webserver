import {
  validateZipCode,
  validatePhoneNumber,
  validateHouseNumber,
  validateAllowedCharacters,
} from './validatorRules.helper';

export const getRequiredRule = intl => ({
  required: true,
  whitespace: true,
  message: intl.formatMessage({
    id: 'Form.Validation.isRequired',
  }),
});

export const getStringsRule = intl => ({
  validator: validateAllowedCharacters,
  message: intl.formatMessage({ id: `Form.Validation.invalidCharacter` }),
});

export const getHouseNumberRule = intl => ({
  validator: validateHouseNumber,
  message: intl.formatMessage({ id: `Form.Validation.invalidCharacter` }),
});

export const getZipCodeRule = intl => ({
  validator: validateZipCode,
  message: intl.formatMessage({ id: 'Form.Validation.zip' }),
});

export const getMaxLengthRule = (intl, maxLength) => ({
  max: maxLength,
  message: intl.formatMessage({ id: 'Form.Validation.toLong' }),
});

export const getEmailRule = intl => ({
  type: 'email',
  message: intl.formatMessage({ id: 'Form.Validation.email' }),
});

export const getPhoneNumberRule = intl => ({
  validator: validatePhoneNumber,
  message: intl.formatMessage({ id: 'Form.Validation.unsupportedFormat' }),
});
