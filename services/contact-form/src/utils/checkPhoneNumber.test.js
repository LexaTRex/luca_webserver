import { isValidPhoneNumber } from './checkPhoneNumber';

const PHONE_NUMBER_TEST_CASES_VALID = [
  '+4917112345678',
  '+49 171 12345678',
  '+49/171/12345678',
  '004917112345678',
  '03012345678',
  '017112345678',
  ' 017112345678  ',
  '0 1 7 1 1 2 3 4 5 6 7 8',
  '+43 1777809864',
  '+852 7777 3333',
  '+39 347 1234567',
];

const PHONE_NUMBER_TEST_CASES_INVALID = [
  '0',
  '',
  '123',
  '52345',
  '12345678000+!=',
  '017112345678asdf',
  '+49456778945666666666933',
  '             ',
  'notanumber',
];

describe('Phone number validation', () => {
  it('accepts valid phone numbers', () => {
    PHONE_NUMBER_TEST_CASES_VALID.map(testCase =>
      expect(isValidPhoneNumber(testCase)).toBe(true)
    );
  });

  it('rejects invalid phone numbers', () => {
    PHONE_NUMBER_TEST_CASES_INVALID.map(testCase =>
      expect(isValidPhoneNumber(testCase)).toBe(false)
    );
  });
});
