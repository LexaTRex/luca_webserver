import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import {
  getEmailRule,
  getZipCodeRule,
  getRequiredRule,
  getMaxLengthRule,
  getPhoneNumberRule,
  getStringsRule,
  getHouseNumberRule,
} from 'utils/validatorRules';
import {
  MAX_NAME_LENGTH,
  MAX_CITY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_STREET_LENGTH,
  MAX_POSTAL_CODE_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
} from 'constants/valueLength';

export const useNameValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getStringsRule(intl),
      getMaxLengthRule(intl, MAX_NAME_LENGTH),
    ],
    [intl]
  );
};

export const useZipCodeValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getMaxLengthRule(intl, MAX_POSTAL_CODE_LENGTH),
      getZipCodeRule(intl),
    ],
    [intl]
  );
};

export const useCityValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getStringsRule(intl),
      getMaxLengthRule(intl, MAX_CITY_LENGTH),
    ],
    [intl]
  );
};

export const useHouseNumberValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getHouseNumberRule(intl),
      getMaxLengthRule(intl, MAX_HOUSE_NUMBER_LENGTH),
    ],
    [intl]
  );
};

export const useStreetValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getStringsRule(intl),
      getMaxLengthRule(intl, MAX_STREET_LENGTH),
    ],
    [intl]
  );
};

export const useEmailValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [getMaxLengthRule(intl, MAX_EMAIL_LENGTH), getEmailRule(intl)],
    [intl]
  );
};

export const usePhoneNumberValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getMaxLengthRule(intl, MAX_PHONE_LENGTH),
      getPhoneNumberRule(intl),
    ],
    [intl]
  );
};
