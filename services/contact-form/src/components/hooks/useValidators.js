import { useIntl } from 'react-intl';

import {
  MAX_NAME_LENGTH,
  MAX_CITY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_STREET_LENGTH,
  MAX_POSTAL_CODE_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
} from 'constants/valueLength';

import {
  getRequiredRule,
  getZipCodeRule,
  getPhoneRule,
  getEmailRule,
  getNamesRule,
  getMaxLengthRule,
  getTableNoRule,
  getHouseNoRule,
} from 'utils/validatorRules';

import {
  invalidFirstName,
  invalidLastName,
  invalidStreet,
  invalidZipCode,
  invalidCity,
  invalidPhone,
  invalidEmail,
  invalidHouseNo,
  invalidTableNo,
} from 'constants/errorMessages';

export const useNameValidator = () => {
  const intl = useIntl();
  const firstNameValidator = [
    getRequiredRule(intl),
    getNamesRule(intl, invalidFirstName),
    getMaxLengthRule(intl, MAX_NAME_LENGTH),
  ];
  const lastNameValidator = [
    getRequiredRule(intl),
    getNamesRule(intl, invalidLastName),
    getMaxLengthRule(intl, MAX_NAME_LENGTH),
  ];
  return { firstNameValidator, lastNameValidator };
};

export const useAddressValidator = () => {
  const intl = useIntl();
  const streetValidator = [
    getRequiredRule(intl),
    getNamesRule(intl, invalidStreet),
    getMaxLengthRule(intl, MAX_STREET_LENGTH),
  ];
  const houseNoValidator = [
    getRequiredRule(intl),
    getHouseNoRule(intl, invalidHouseNo),
    getMaxLengthRule(intl, MAX_HOUSE_NUMBER_LENGTH),
  ];
  const zipCodValidator = [
    getRequiredRule(intl),
    getZipCodeRule(intl, invalidZipCode),
    getMaxLengthRule(intl, MAX_POSTAL_CODE_LENGTH),
  ];
  const cityValidator = [
    getRequiredRule(intl),
    getNamesRule(intl, invalidCity),
    getMaxLengthRule(intl, MAX_CITY_LENGTH),
  ];
  return { streetValidator, houseNoValidator, zipCodValidator, cityValidator };
};

export const usePhoneValidator = () => {
  const intl = useIntl();
  const phoneValidator = [
    getRequiredRule(intl),
    getPhoneRule(intl, invalidPhone),
  ];
  return { phoneValidator };
};

export const useEmailValidator = () => {
  const intl = useIntl();
  const emailValidator = [
    getEmailRule(intl, invalidEmail),
    getMaxLengthRule(intl, MAX_EMAIL_LENGTH),
  ];
  return { emailValidator };
};

export const useTableValidator = () => {
  const intl = useIntl();
  const tableValidator = [getTableNoRule(intl, invalidTableNo)];
  return { tableValidator };
};
