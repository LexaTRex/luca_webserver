import {
  DEFAULT_LOCATION_NAME_EN,
  DEFAULT_LOCATION_NAME_DE,
} from 'constants/locations';

import { checkPhoneNumber } from './parsePhoneNumber';

export const showErrorNotification = (notification, intl, errorMessage) => {
  notification.error({
    message: intl.formatMessage(errorMessage),
  });
};

export const getRequiredRule = (intl, message) => ({
  required: true,
  whitespace: true,
  message: intl.formatMessage(message),
});

export const getPhoneRules = intl => ({
  validator: (_, value) => {
    return checkPhoneNumber(value)
      ? Promise.resolve()
      : Promise.reject(
          intl.formatMessage({
            id: 'error.phone.invalid',
          })
        );
  },
});

export const getDefaultNameRule = intl => () => ({
  validator: (rule, value) => {
    if (
      value?.toLowerCase().trim() === DEFAULT_LOCATION_NAME_EN ||
      value?.toLowerCase().trim() === DEFAULT_LOCATION_NAME_DE
    ) {
      return Promise.reject(
        intl.formatMessage({
          id: 'error.locationName.notDefault',
        })
      );
    }
    return Promise.resolve();
  },
});

export const checkExistingLocation = (isLocationNameTaken, intl) => {
  return () => {
    if (isLocationNameTaken) {
      return Promise.reject(
        intl.formatMessage({
          id: 'error.locationName.exist',
        })
      );
    }
    return Promise.resolve();
  };
};
export const getMaxLengthRule = (intl, max) => ({
  max,
  message: intl.formatMessage({ id: 'error.length' }),
});
