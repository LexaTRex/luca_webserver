import parsePhoneNumber from 'libphonenumber-js/max';

export const isValidPhoneNumber = value =>
  !!parsePhoneNumber(value, {
    defaultCountry: 'DE',
    extract: false,
  })?.isValid();
