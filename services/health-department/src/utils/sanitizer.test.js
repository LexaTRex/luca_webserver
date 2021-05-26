import { sanitizeObject } from './sanitizer';

it('prepends a space to leading plus signs', () => {
  const data = { phone: '+1 555 672 1121' };
  expect(sanitizeObject(data).phone).toBe(`'${data.phone}`);
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

it('escapes extra field delimiters', () => {
  const data = { a1: 'hello";"=1+2' };
  expect(sanitizeObject(data).a1).toBe('hello"";""=1+2');
});
