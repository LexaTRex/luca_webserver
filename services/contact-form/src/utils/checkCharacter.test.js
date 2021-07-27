import { isValidCharacter } from './checkCharacter';

const SAFE_STRING_TEST_CASES_VALID = [
  '015100123123',
  'Standort',
  'Giguère',
  'Deschênes',
  'Élisabeth Généreux',
  'Giani Pašić',
  'Shukri Fošnarič',
  'Isaac Nordström',
  ' Władysław Czarnecki  ',
  'Sz õ ke K a ti',
  'Rác Bar-ba-ra',
  'Horváth Szûts S. Agoston II',
  'Johan T. Holst',
  'Yu',
  ' S @ ',
  'Mix & Match',
  't25o7rwlyjewi@temporary-mail.net',
  ' Lietzensee-Ufer 119 ',
];

const SAFE_STRING_TEST_CASES_INVALID = [
  "Carl's Bar",
  '100$ Bill',
  '=CMD()',
  `{hello world}`,
  `"hello world"`,
  '#',
  '^',
  '    *                ',
  '[]',
];

describe('Safe string validation', () => {
  it('accepts valid strings', () => {
    SAFE_STRING_TEST_CASES_VALID.map(testCase =>
      expect(isValidCharacter(testCase)).toBe(true)
    );
  });

  it('rejects invalid strings', () => {
    SAFE_STRING_TEST_CASES_INVALID.map(testCase =>
      expect(isValidCharacter(testCase)).toBe(false)
    );
  });
});
