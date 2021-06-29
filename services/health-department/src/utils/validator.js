export const zipValidator = value => {
  const numberRegex = new RegExp(/^\d+$/);

  if (!value || (value.length === 5 && numberRegex.test(value))) {
    return Promise.resolve();
  }
  return Promise.reject();
};
