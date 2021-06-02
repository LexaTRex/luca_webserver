import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js/max';

export const checkPhoneNumber = phoneNumberValue => {
  const parsedPhoneNumberValue = parsePhoneNumber(phoneNumberValue, {
    defaultCountry: 'DE',
    extract: false,
  });
  if (parsedPhoneNumberValue) {
    const formattedNumberInput = parsedPhoneNumberValue.formatInternational();
    return isValidPhoneNumber(formattedNumberInput);
  }
  return false;
};
