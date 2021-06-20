import { useIntl } from 'react-intl';

import {
  MAX_NAME_LENGTH,
  MAX_CITY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_STREET_LENGTH,
  MAX_POSTAL_CODE_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
} from 'constants/valueLength';
import {
  getRequiredRule,
  getCharsAndNumsRules,
  getNumsRules,
  getZipCodeRules,
  getPhoneRules,
  getEmailRules,
  getWhiteSpaceRule,
  invalidFirstName,
  invalidLastName,
  invalidStreet,
  invalidHouseNo,
  invalidZipCode,
  invalidCity,
  invalidPhone,
  invalidEmail,
  invalidTableNo,
  invalidWhiteSpace,
  getMaxLengthRule,
} from 'utils/validatorRules';

export const useContactDataRules = () => {
  const intl = useIntl();

  const firstNameValidator = () => {
    return [
      getRequiredRule(intl),
      getCharsAndNumsRules(intl, invalidFirstName),
      getWhiteSpaceRule(intl, invalidWhiteSpace),
      getMaxLengthRule(intl, MAX_NAME_LENGTH),
    ];
  };

  const lastNameValidator = () => {
    return [
      getRequiredRule(intl),
      getCharsAndNumsRules(intl, invalidLastName),
      getWhiteSpaceRule(intl, invalidWhiteSpace),
      getMaxLengthRule(intl, MAX_NAME_LENGTH),
    ];
  };

  const streetValidator = () => {
    return [
      getRequiredRule(intl),
      getCharsAndNumsRules(intl, invalidStreet),
      getWhiteSpaceRule(intl, invalidWhiteSpace),
      getMaxLengthRule(intl, MAX_STREET_LENGTH),
    ];
  };

  const houseNoValidator = () => {
    return [
      getRequiredRule(intl),
      getCharsAndNumsRules(intl, invalidHouseNo),
      getWhiteSpaceRule(intl, invalidWhiteSpace),
      getMaxLengthRule(intl, MAX_HOUSE_NUMBER_LENGTH),
    ];
  };

  const zipCodeValidator = () => {
    return [
      getRequiredRule(intl),
      getZipCodeRules(intl, invalidZipCode),
      getWhiteSpaceRule(intl, invalidWhiteSpace),
      getMaxLengthRule(intl, MAX_POSTAL_CODE_LENGTH),
    ];
  };

  const cityValidator = () => {
    return [
      getRequiredRule(intl),
      getCharsAndNumsRules(intl, invalidCity),
      getWhiteSpaceRule(intl, invalidWhiteSpace),
      getMaxLengthRule(intl, MAX_CITY_LENGTH),
    ];
  };

  const phoneValidator = () => {
    return [
      getRequiredRule(intl),
      getPhoneRules(intl, invalidPhone),
      getMaxLengthRule(intl, MAX_PHONE_LENGTH),
    ];
  };

  const emailValidator = () => {
    return [
      getWhiteSpaceRule(intl, invalidWhiteSpace),
      getEmailRules(intl, invalidEmail),
      getMaxLengthRule(intl, MAX_EMAIL_LENGTH),
    ];
  };

  const tableValidator = () => {
    return [getNumsRules(intl, invalidTableNo)];
  };

  return {
    firstNameValidator,
    lastNameValidator,
    streetValidator,
    houseNoValidator,
    zipCodeValidator,
    cityValidator,
    phoneValidator,
    emailValidator,
    tableValidator,
  };
};
