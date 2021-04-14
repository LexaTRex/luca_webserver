export const nameChanged = (oldValues, newValues) =>
  oldValues.firstName !== newValues.firstName ||
  oldValues.lastName !== newValues.lastName;

export const mailChanged = (oldValues, newValues) =>
  oldValues.email !== newValues.email;
