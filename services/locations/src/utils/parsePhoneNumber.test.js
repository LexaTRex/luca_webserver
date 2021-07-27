import { isValidPhoneNumber } from './parsePhoneNumber';

describe('Phone number validation', () => {
  it('accepts valid phone numbers', () => {
    const validPhoneNumbers = [
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
    validPhoneNumbers.map(number =>
      expect(isValidPhoneNumber(number)).toBe(true)
    );
  });

  it('rejects invalid phone numbers', () => {
    const inValidPhoneNumbers = [
      '0',
      '',
      'abcd',
      '22345',
      '52345',
      '12345678000+!=',
      '017112345678asdf',
      '+49456778945666666666933',
      '                    ',
    ];
    inValidPhoneNumbers.map(number =>
      expect(isValidPhoneNumber(number)).toBe(false)
    );
  });
});
