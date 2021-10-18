// eslint-disable-next-line no-useless-escape
const specialCharactersFormat = /[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}\-]+/;

const numberFormat = /\d/;

const lowerCaseFormat = /[a-zäöüß]/;

const upperCaseFormat = /[A-ZÄÖÜ]/;

export const hasSufficientLength = password => password.length > 8;

const isNotTooLong = password => password.length < 255;

export const hasNumber = password => numberFormat.test(password);

export const hasLowerCase = password => lowerCaseFormat.test(password);

export const hasUpperCase = password => upperCaseFormat.test(password);

export const hasSpecialCharacter = password =>
  specialCharactersFormat.test(password);

export const passwordMeetsCriteria = password => {
  const lengthCheck = hasSufficientLength(password) && isNotTooLong(password);
  const numberCheck = hasNumber(password);
  const lowerCaseCheck = hasLowerCase(password);
  const upperCaseCheck = hasUpperCase(password);
  const specialCharacterCheck = hasSpecialCharacter(password);

  return (
    lengthCheck &&
    numberCheck &&
    lowerCaseCheck &&
    upperCaseCheck &&
    specialCharacterCheck
  );
};
