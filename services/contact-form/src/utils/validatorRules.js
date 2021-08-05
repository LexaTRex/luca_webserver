import {
  validateHouseNo,
  validateStrings,
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

export const getStringsRule = (intl, fieldName) => ({
  validator: validateStrings,
  message: intl.formatMessage({ id: `contactDataForm.invalid.${fieldName}` }),
});

export const getZipCodeRule = intl => ({
  validator: validateZipCode,
  message: intl.formatMessage({ id: 'contactDataForm.invalid.zipCode' }),
});

export const getPhoneRule = intl => ({
  validator: validatePhoneNumber,
  message: intl.formatMessage({ id: 'contactDataForm.invalid.phone' }),
});

export const getEmailRule = intl => ({
  type: 'email',
  message: intl.formatMessage({ id: 'contactDataForm.invalid.email' }),
});

export const getHouseNoRule = intl => ({
  validator: validateHouseNo,
  message: intl.formatMessage({ id: 'contactDataForm.invalid.houseNo' }),
});

export const getTableNoRule = intl => ({
  type: 'number',
  message: intl.formatMessage({ id: 'contactDataForm.invalid.invalidTableNo' }),
});

export const getMaxLengthRule = (intl, max) => ({
  max,
  message: intl.formatMessage({ id: 'contactDataForm.invalid.length' }),
});
