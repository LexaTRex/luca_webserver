import { useIntl } from 'react-intl';

import {
  MAX_NAME_LENGTH,
  MAX_CITY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_STREET_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
  MAX_LOCATION_NAME_LENGTH,
} from 'constants/valueLength';

import {
  getRequiredRule,
  getZipCodeRule,
  getPhoneRule,
  getEmailRule,
  getSafeStringRule,
  getTextSafeStringRule,
  getMaxLengthRule,
  getTableNoRule,
  getCheckoutRadiusRule,
  getNoNumericRule,
} from 'utils/validatorRules';
import { useMemo } from 'react';

export const useLocationNameValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl, fieldName),
      getSafeStringRule(intl, fieldName),
      getMaxLengthRule(intl, MAX_LOCATION_NAME_LENGTH),
    ],
    [intl, fieldName]
  );
};

export const usePersonNameValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl, fieldName),
      getSafeStringRule(intl, fieldName),
      getNoNumericRule(intl, fieldName),
      getMaxLengthRule(intl, MAX_NAME_LENGTH),
    ],
    [intl, fieldName]
  );
};

export const useStreetValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl, fieldName),
      getSafeStringRule(intl, fieldName),
      getNoNumericRule(intl, fieldName),
      getMaxLengthRule(intl, MAX_STREET_LENGTH),
    ],
    [intl, fieldName]
  );
};
export const useHouseNoValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl, fieldName),
      getSafeStringRule(intl, fieldName),
      getMaxLengthRule(intl, MAX_HOUSE_NUMBER_LENGTH),
    ],
    [intl, fieldName]
  );
};

export const useZipCodeValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [getRequiredRule(intl, fieldName), getZipCodeRule(intl)],
    [intl, fieldName]
  );
};

export const useCityValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl, fieldName),
      getSafeStringRule(intl, fieldName),
      getNoNumericRule(intl, fieldName),
      getMaxLengthRule(intl, MAX_CITY_LENGTH),
    ],
    [intl, fieldName]
  );
};

export const usePhoneValidator = fieldName => {
  const intl = useIntl();
  return useMemo(() => [getRequiredRule(intl, fieldName), getPhoneRule(intl)], [
    intl,
    fieldName,
  ]);
};

export const useEmailValidator = () => {
  const intl = useIntl();
  return useMemo(
    () => [getEmailRule(intl), getMaxLengthRule(intl, MAX_EMAIL_LENGTH)],
    [intl]
  );
};

export const useTableNumberValidator = () => {
  const intl = useIntl();
  return useMemo(() => [getTableNoRule(intl)], [intl]);
};

export const useCheckoutRadiusValidator = () => {
  const intl = useIntl();
  return useMemo(() => [getCheckoutRadiusRule(intl)], [intl]);
};

export const useOptionalPhoneValidator = () => {
  const intl = useIntl();
  return useMemo(() => [getPhoneRule(intl)], [intl]);
};

export const useTextAreaValidator = (fieldName, maxValue) => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl, fieldName),
      getTextSafeStringRule(intl, fieldName),
      getMaxLengthRule(intl, maxValue),
    ],
    [intl, fieldName, maxValue]
  );
};
