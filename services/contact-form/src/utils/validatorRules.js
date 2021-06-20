export const invalidFirstName = {
  id: 'contactDataForm.invalid.firstName',
};
export const invalidLastName = {
  id: 'contactDataForm.invalid.lastName',
};
export const invalidStreet = {
  id: 'contactDataForm.invalid.Street',
};
export const invalidHouseNo = {
  id: 'contactDataForm.invalid.HouseNo',
};
export const invalidZipCode = {
  id: 'contactDataForm.invalid.ZipCode',
};
export const invalidCity = {
  id: 'contactDataForm.invalid.city',
};
export const invalidPhone = {
  id: 'contactDataForm.invalid.phone',
};
export const invalidEmail = {
  id: 'contactDataForm.invalid.email',
};
export const invalidTableNo = {
  id: 'contactDataForm.invalid.invalidTableNo',
};
export const invalidWhiteSpace = {
  id: 'contactDataForm.invalid.whiteSpace',
};

export const getRequiredRule = intl => ({
  required: true,
  message: intl.formatMessage({
    id: 'contactDataForm.isRequired',
  }),
});

export const getCharsAndNumsRules = (intl, message) => ({
  pattern: /^(?!\s*$)[\d ',.a-zßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿąćčėęįłńœšūųźżž∂-]+$/i,
  message: intl.formatMessage(message),
});

export const getNumsRules = (intl, message) => ({
  pattern: /^\d+$/,
  message: intl.formatMessage(message),
});

export const getZipCodeRules = (intl, message) => ({
  pattern: /\b\d{5}\b/,
  message: intl.formatMessage(message),
});

export const getPhoneRules = (intl, message) => ({
  pattern: /^\+*\(?\d{1,3}\)?[\d\s./-]{7,20}$/g,
  message: intl.formatMessage(message),
});

export const getEmailRules = (intl, message) => ({
  pattern: /^\S+@\S+\.\S+$/g,
  message: intl.formatMessage(message),
});

export const getWhiteSpaceRule = (intl, message) => ({
  pattern: /^\S/,
  message: intl.formatMessage(message),
});
export const getMaxLengthRule = (intl, max) => ({
  max,
  message: intl.formatMessage({ id: 'contactDataForm.invalid.length' }),
});

// export const getWhiteSpaceIntRule = (intl, message) => ({
//   pattern: /^[0-9]/,
//   message: intl.formatMessage(message),
// })
