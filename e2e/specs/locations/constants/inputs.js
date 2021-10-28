// email
export const NEW_E2E_EMAIL = 'unknown@nexenio.com';

// name
export const NEW_E2E_FIRST_NAME = 'E2E';

export const NEW_E2E_LAST_NAME = 'User';

// password
export const NEW_E2E_VALID_PASSWORD = 'Nexenio123!';

export const TOO_SHORT_PASSWORD = 'Abc1!';

export const NO_NUMBER_PASSWORD = 'Abcdefghi!';

export const NO_UPPER_CASE_PASSWORD = 'abcdefghi1!';

export const NO_LOWER_CASE_PASSWORD = 'ABCDEFGHI1!';

export const NO_SPECIAL_CHAR_PASSWORD = 'ABCDEFGHI1';

export const SOME_OTHER_INVALID_PASSWORD = 'Some0therVal1dPassword!';

export const WRONG_PASSWORD = 'WRONG_PASSWORD';

// Phone Numbers
export const VALID_PHONE_NUMBERS = [
  '0150 00123123',
  '030 123 456',
  '(030) 123-456',
  '+49150 00123123',
];

export const INVALID_PHONE_NUMBERS = ['123', 'notanumber', '123NotANumber'];

// Messages
export const VALID_MESSAGES = [
  'Message valid',
  "Hello. How are you? I'm fine!",
  '#+*!Testing{here} (supportMail)@',
];

export const tooLongMessage = 'a'.repeat(3001);

export const INVALID_MESSAGES = [
  'https://test.me',
  'http://test.me',
  'ftp://test.me',
  ' ',
  tooLongMessage,
];
