export const requiresPhone = {
  id: 'error.phone',
};
export const invalidPhone = {
  id: 'error.phone.invalid',
};

export const requiresGroupName = {
  id: 'error.groupName',
};

export const getRequiredRule = (intl, message) => ({
  required: true,
  message: intl.formatMessage(message),
});

export const getPhoneRules = (intl, message) => ({
  pattern: /^\+*\({0,1}\d{1,3}\){0,1}[\d\s./-]{7,20}$/g,
  message: intl.formatMessage(message),
});

export const getMaxLengthRule = (intl, max) => ({
  max,
  message: intl.formatMessage({ id: 'error.length' }),
});
