import {
  getMaxLengthRule,
  getRequiredRule,
  getPhoneRule,
  getEmailRule,
  getSafeStringRule,
  getNoNumericRule,
} from 'utils/validatorRules';
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from 'constants/valueLength';

export const getFormElements = intl => [
  {
    key: 'firstName',
    rules: [
      getRequiredRule(intl, 'firstName'),
      getSafeStringRule(intl, 'firstName'),
      getNoNumericRule(intl, 'firstName'),
      getMaxLengthRule(intl, MAX_NAME_LENGTH),
    ],
  },
  {
    key: 'lastName',
    rules: [
      getRequiredRule(intl, 'lastName'),
      getSafeStringRule(intl, 'lastName'),
      getNoNumericRule(intl, 'lastName'),
      getMaxLengthRule(intl, MAX_NAME_LENGTH),
    ],
  },
  {
    key: 'phone',
    rules: [getRequiredRule(intl, 'phone'), getPhoneRule(intl)],
  },
  {
    key: 'email',
    rules: [
      getRequiredRule(intl, 'email'),
      getEmailRule(intl),
      getMaxLengthRule(intl, MAX_EMAIL_LENGTH),
    ],
  },
];
