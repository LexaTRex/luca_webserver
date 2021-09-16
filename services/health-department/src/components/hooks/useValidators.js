import { useIntl } from 'react-intl';

import { MAX_NAME_LENGTH, MAX_EMAIL_LENGTH } from 'constants/valueLength';

import {
  getRequiredRule,
  getPhoneRule,
  getEmailRule,
  getSafeStringRule,
  getMaxLengthRule,
  getNoNumericRule,
} from 'utils/validatorRules';
import { useMemo } from 'react';

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

export const usePhoneValidator = fieldName => {
  const intl = useIntl();
  return useMemo(() => [getRequiredRule(intl, fieldName), getPhoneRule(intl)], [
    intl,
    fieldName,
  ]);
};

export const useEmailValidator = fieldName => {
  const intl = useIntl();
  return useMemo(
    () => [
      getRequiredRule(intl, fieldName),
      getEmailRule(intl),
      getMaxLengthRule(intl, MAX_EMAIL_LENGTH),
    ],
    [intl, fieldName]
  );
};