import { useIntl } from 'react-intl';
import { useMemo } from 'react';

import {
  MAX_NAME_LENGTH,
  MAX_CITY_LENGTH,
  MAX_STREET_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
} from 'constants/valueLength';

import {
  getRequiredRule,
  getZipCodeRule,
  getPhoneRule,
  getEmailRule,
  getStringsRule,
  getMaxLengthRule,
  getTableNoRule,
  getHouseNoRule,
} from 'utils/validatorRules';

export const usePersonNameValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getStringsRule(intl, fieldName),
      getMaxLengthRule(intl, MAX_NAME_LENGTH),
    ],
    [intl, fieldName]
  );
};

export const useStreetValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getStringsRule(intl, fieldName),
      getMaxLengthRule(intl, MAX_STREET_LENGTH),
    ],
    [intl, fieldName]
  );
};

export const useHouseNoValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getHouseNoRule(intl),
      getMaxLengthRule(intl, MAX_HOUSE_NUMBER_LENGTH),
    ],
    [intl]
  );
};

export const useZipCodValidator = () => {
  const intl = useIntl();
  return useMemo(() => [getRequiredRule(intl), getZipCodeRule(intl)], [intl]);
};

export const useCityValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl),
      getStringsRule(intl, fieldName),
      getMaxLengthRule(intl, MAX_CITY_LENGTH),
    ],
    [intl, fieldName]
  );
};

export const usePhoneValidator = () => {
  const intl = useIntl();
  return useMemo(() => [getRequiredRule(intl), getPhoneRule(intl)], [intl]);
};

export const useEmailValidator = () => {
  const intl = useIntl();
  return useMemo(() => [getEmailRule(intl)], [intl]);
};

export const useTableValidator = () => {
  const intl = useIntl();
  return useMemo(() => [getTableNoRule(intl)], [intl]);
};
