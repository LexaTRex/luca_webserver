// eslint-disable-next-line no-useless-escape
const specialCharactersFormat = /[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}\-]+/;

const numberFormat = /\d/;

const lowerCaseFormat = /[a-z]/;

const upperCaseFormat = /[A-Z]/;

const hasSufficientLength = password => password.length > 8;

const isNotTooLong = password => password.length < 255;

const hasNumber = password => numberFormat.test(password);

const hasLowerCase = password => lowerCaseFormat.test(password);

const hasUpperCase = password => upperCaseFormat.test(password);

const hasSpecialCharacter = password => specialCharactersFormat.test(password);

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
