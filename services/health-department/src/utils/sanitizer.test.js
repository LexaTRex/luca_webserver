import { sanitizeObject, sanitizeForCSV } from './sanitizer';

it('prepends a space to leading plus signs', () => {
  const data = { phone: '+1 555 672 1121' };
  expect(sanitizeObject(data).phone).toBe(`001 555 672 1121`);
});

it('removes newline characters', () => {
  const data = { newline: '"\n\n"=1+2";"', linefeed: 'l\ruca\r\napp.de' };
  const sanitized = sanitizeObject(data);
  Object.values(sanitized).forEach(value => {
    expect(value).not.toContain('\n');
    expect(value).not.toContain('\r');
  });
});

it('handles undefined', () => {
  const data = { this: undefined };
  expect(() => sanitizeObject(data)).not.toThrow();
});

it('removes extra field delimiters', () => {
  const data = { a1: 'hello";"=1+2' };
  expect(sanitizeObject(data).a1).toBe('hello 1+2');
});
it('handles valid names/characters', () => {
  const names = [
    'René',
    'ÇĆČçćč',
    'der Große-König',
    'Jr. Tœže',
    'çæœŒßäëïöüÿãñõâêîôûáéíóúýàèìòùÄËÏÖÜŸÃÑÕÂÊÎÔÛÁÉÍÓÚÝÀÈÌÒÙÇÆŒŒÀ-ÿ',
    // all european characters
    'ëñä+æøåÅÖßöüĈĝĥĵŝŭõðýÞèéàáâôœçûíóúĩĸũìùđķļņŗįųėħċģāūōēīńźżłśćąęãţăŦčšĺěřůžıİğőű£ơưŵŷ',
  ];
  names.forEach(name => {
    expect(sanitizeForCSV(name)).toBe(name);
  });
});

it('handles valid mails', () => {
  const validEmails = [
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    'email@123.123.123.123',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.test',
    'email@example.co.jp',
    'email@example.co.jp',
    'firstname-lastname_@example.com',
  ];
  validEmails.forEach(mail => {
    expect(sanitizeForCSV(mail)).toBe(mail);
  });
});

it('handles/removes formulas', () => {
  const formulars = {
    '\t\r-1+1': '_1+1',
    '-1+1': '_1+1',
    '+1-1': '001-1',
    '=-1+1': '_1+1',
    '=--1+1': '_1+1',
    '=+1-1': '_1-1',
    '"-1+1"': '_1+1 ',
    '"+1-1"': '_1-1 ',
    '"=-1+1"': '_1+1 ',
    '"=+1-1"': '_1-1 ',
    '\t"=+1-1"': '_1-1 ',
    '\r"\t=+1-1"': '_1-1 ',
    '=WURZEL(9);': '_WURZEL 9 ',
    '"=WURZEL(9)";': '_WURZEL 9 ',
    '=SQRT(9);': '_SQRT 9 ',
    '"=SQRT(9)"': '_SQRT 9 ',
    "'=SQRT(9)'": '_SQRT 9 ',
    "=2+5+cmd|' /C calc'!A0": '_2+5+cmd   C calc A0',
  };
  Object.keys(formulars).forEach(value => {
    expect(sanitizeForCSV(value)).toBe(formulars[value]);
  });
});
it('handles other input', () => {
  const undef = undefined;
  expect(sanitizeForCSV(undef)).toBe('');
  expect(sanitizeForCSV(-1)).toBe('-1');
  expect(sanitizeForCSV(null)).toBe('');
});
