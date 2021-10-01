import {
  DEFAULT_CHECKOUT_RADIUS,
  MAX_CHECKOUT_RADIUS,
} from 'constants/checkout';

import {
  validateDefaultName,
  checkExistingLocation,
  validatePhoneNumber,
  validateSafeString,
  validateTextSafeString,
  validateZipCode,
  validateEmail,
  validateNoNumeric,
} from './validatorRules.helper';
import { MAX_TABLE_NUMBER, MIN_TABLE_NUMBER } from '../constants/tableNumber';

export const getRequiredRule = (intl, fieldName) => ({
  required: true,
  whitespace: true,
  message: intl.formatMessage({ id: `error.${fieldName}` }),
});

export const getSafeStringRule = (intl, fieldName) => ({
  validator: validateSafeString,
  message: intl.formatMessage({ id: `error.${fieldName}.invalid` }),
});

export const getTextSafeStringRule = (intl, fieldName) => ({
  validator: validateTextSafeString,
  message: intl.formatMessage({ id: `error.${fieldName}.invalid` }),
});

export const getNoNumericRule = (intl, fieldName) => ({
  validator: validateNoNumeric,
  message: intl.formatMessage({ id: `error.${fieldName}.invalid` }),
});

export const getMaxLengthRule = (intl, max) => ({
  max,
  message: intl.formatMessage({ id: 'error.length' }),
});

export const getPhoneRule = intl => ({
  validator: validatePhoneNumber,
  message: intl.formatMessage({ id: 'error.phone.invalid' }),
});

export const getDefaultNameRule = intl => ({
  validator: validateDefaultName,
  message: intl.formatMessage({ id: 'error.locationName.notDefault' }),
});

export const getUniqueNameRule = (intl, isLocationNameTaken) => ({
  required: isLocationNameTaken,
  validator: checkExistingLocation(isLocationNameTaken),
  message: intl.formatMessage({ id: 'error.locationName.exist' }),
});

export const getZipCodeRule = intl => ({
  validator: validateZipCode,
  message: intl.formatMessage({ id: 'error.zipCode.invalid' }),
});

export const getEmailRule = intl => ({
  validator: validateEmail,
  message: intl.formatMessage({ id: 'error.email' }),
});

export const getTableNoRule = intl => ({
  type: 'number',
  required: true,
  min: MIN_TABLE_NUMBER,
  max: MAX_TABLE_NUMBER,
  message: intl.formatMessage({
    id: 'error.tableCount',
  }),
});

export const getCheckoutRadiusRule = intl => ({
  type: 'number',
  required: true,
  min: DEFAULT_CHECKOUT_RADIUS,
  max: MAX_CHECKOUT_RADIUS,
  message: intl.formatMessage({
    id: 'settings.location.checkout.automatic.range',
  }),
});
