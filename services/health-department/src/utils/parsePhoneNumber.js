import parsePhoneNumber from 'libphonenumber-js/max';

export const getFormattedPhoneNumber = phone =>
  parsePhoneNumber(phone, 'DE').formatInternational();

export const isValidPhoneNumber = value =>
  !!parsePhoneNumber(value, {
    defaultCountry: 'DE',
    extract: false,
  })?.isValid();
