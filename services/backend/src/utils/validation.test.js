const { expect } = require('chai');
const { z } = require('./validation');

const PHONE_NUMBER_TEST_CASES_VALID = [
  '0150 00123123',
  '030 123 456',
  '(030) 123-456',
  '+49150 00123123',
  '+4930 123 456',
  '+44 20 1234 5678',
  '(408) 123-4567',
];
const PHONE_NUMBER_TEST_CASES_INVALID = [
  null,
  undefined,
  1234,
  '123',
  'notanumber',
];

const SAFE_STRING_TEST_CASES_VALID = ['015100123123', 'Standort', 'a@bc.de'];
const SAFE_STRING_TEST_CASES_INVALID = [
  "Carl's Bar",
  '100$ Bill',
  '=CMD()',
  'HtTp://example.com',
  'click here HtTp://example.com',
  null,
  undefined,
  1234,
];

describe('validation', () => {
  describe('object', () => {
    it('strips unknown keys', async () => {
      const schema = z.object({ test: z.string() });
      const inputObject = { test: 'test', unknown: 'test' };
      const expectedOutput = { test: 'test' };
      expect(schema.parse(inputObject)).to.deep.equal(expectedOutput);
    });
  });

  describe('phoneNumber', () => {
    it('should accept valid phone numbers', async () => {
      const schema = z.phoneNumber();
      for (const testCase of PHONE_NUMBER_TEST_CASES_VALID) {
        expect(() => schema.parse(testCase)).to.not.throw();
        expect(schema.parse(testCase)).to.equal(testCase);
      }
    });

    it('should reject invalid phone numbers', async () => {
      const schema = z.phoneNumber();
      for (const testCase of PHONE_NUMBER_TEST_CASES_INVALID) {
        expect(() => schema.parse(testCase)).to.throw(z.ZodError);
      }
    });
  });

  describe('safeString', () => {
    it('should accept valid strings', async () => {
      const schema = z.safeString().max(255);
      for (const testCase of SAFE_STRING_TEST_CASES_VALID) {
        expect(() => schema.parse(testCase)).to.not.throw();
        expect(schema.parse(testCase)).to.equal(testCase);
      }
    });

    it('should reject invalid strings', async () => {
      const schema = z.safeString();
      for (const testCase of SAFE_STRING_TEST_CASES_INVALID) {
        expect(() => schema.parse(testCase)).to.throw(z.ZodError);
      }
    });

    it('should reject too long strings', async () => {
      const schema = z.safeString().max(3);
      expect(() => schema.parse('test')).to.throw(z.ZodError);
    });
  });

  describe('strongPassword', () => {
    let schema;
    before(() => {
      schema = z.strongPassword();
    });

    it('should accept strong passwords', async () => {
      expect(() => schema.parse('nTdRT9EjWVg(')).to.not.throw();
      expect(() => schema.parse(',867f4686?%72V+R${#[8*wAML&t')).to.not.throw();
    });

    it('should reject short passwords', async () => {
      expect(() => schema.parse('')).to.throw(z.ZodError);
      expect(() => schema.parse('abcdef')).to.throw(z.ZodError);
      expect(() => schema.parse('a1Cd%!6')).to.throw(z.ZodError);
    });
    it('should reject passwords without lowercase characters', async () => {
      expect(() => schema.parse('ABC124!@#........')).to.throw(z.ZodError);
    });
    it('should reject passwords without uppercase characters', async () => {
      expect(() => schema.parse('abc124!@#........')).to.throw(z.ZodError);
    });
    it('should reject passwords without numbers', async () => {
      expect(() => schema.parse('abcABC!@#........')).to.throw(z.ZodError);
    });
    it('should reject passwords without symbols', async () => {
      expect(() => schema.parse('abcABC123aaaaaaaa')).to.throw(z.ZodError);
    });
  });

  describe('uuid', () => {
    let schema;
    before(() => {
      schema = z.uuid();
    });

    it('should accept v4 uuid', async () => {
      expect(() =>
        schema.parse('ebca725f-6c9c-4870-bcff-1fcb852a56b3')
      ).to.not.throw();
    });
    it('should accept non-v4 uuid', async () => {
      expect(() =>
        schema.parse('ffa3bb2b-fd75-ffff-ffff-facab27ddcea')
      ).to.not.throw();
    });
    it('should reject invalid uuids', async () => {
      expect(() =>
        schema.parse('ffa3bb2b-fd75-ffff-ffff-facab27ddcea/')
      ).to.throw(z.ZodError);
      expect(() => schema.parse('ffa3bb2bfd75fffffffffacab27ddcea')).to.throw(
        z.ZodError
      );
    });
  });

  describe('zipCode', () => {
    let schema;
    before(() => {
      schema = z.zipCode();
    });

    it('should accept valid zipCodes', async () => {
      expect(() => schema.parse('12345')).to.not.throw();
    });
    it('should reject invalid zipCodes', async () => {
      expect(() =>
        schema.parse('ffa3bb2b-fd75-ffff-ffff-facab27ddcea')
      ).to.throw(z.ZodError);
      expect(() => schema.parse('abcdef')).to.throw(z.ZodError);
    });
  });

  describe('integerString', () => {
    let schema;
    before(() => {
      schema = z.integerString();
    });

    it('should accept valid integer strings and parse them into numbers', async () => {
      expect(schema.parse(String(Number.MIN_SAFE_INTEGER + 1))).to.equal(
        Number.MIN_SAFE_INTEGER + 1
      );
      expect(schema.parse('-100')).to.equal(-100);
      expect(schema.parse('-0')).to.equal(0);
      expect(schema.parse('0')).to.equal(0);
      expect(schema.parse('12345')).to.equal(12345);
      expect(schema.parse(String(Number.MAX_SAFE_INTEGER - 1))).to.equal(
        Number.MAX_SAFE_INTEGER - 1
      );
    });
    it('should reject hex values', async () => {
      expect(() => schema.parse('ff')).to.throw(z.ZodError);
      expect(() => schema.parse('0xff')).to.throw(z.ZodError);
    });

    it('should reject leading zeros', async () => {
      expect(() => schema.parse('0123')).to.throw(z.ZodError);
      expect(() => schema.parse('00000')).to.throw(z.ZodError);
    });
    it('should reject infinity and NaN', async () => {
      expect(() => schema.parse('Infinity')).to.throw(z.ZodError);
      expect(() => schema.parse('NaN')).to.throw(z.ZodError);
      expect(() => schema.parse('undefined')).to.throw(z.ZodError);
      expect(() => schema.parse('null')).to.throw(z.ZodError);
    });
    it('should reject too large numbers', async () => {
      expect(() => schema.parse(String(Number.MAX_SAFE_INTEGER))).to.throw(
        z.ZodError
      );
    });
    it('should reject too small numbers', async () => {
      expect(() => schema.parse(String(Number.MIN_SAFE_INTEGER))).to.throw(
        z.ZodError
      );
    });
    it('should reject floats', async () => {
      expect(() => schema.parse('0.0')).to.throw(z.ZodError);
      expect(() => schema.parse('0,0')).to.throw(z.ZodError);
      expect(() => schema.parse('2.0')).to.throw(z.ZodError);
      expect(() => schema.parse('2,0')).to.throw(z.ZodError);
    });
  });

  describe('base64', () => {
    it('should accept valid base64', async () => {
      const schema = z.base64({ rawLength: 4 });
      expect(() => schema.parse('dGVzdA==')).to.not.throw();
    });

    it('should reject invalid padding', async () => {
      const schema = z.base64();
      expect(() => schema.parse('dGVzdA')).to.throw(z.ZodError);
    });

    it('should reject non-base64', async () => {
      const schema = z.base64();
      expect(() => schema.parse('caffee')).to.throw(z.ZodError);
    });
    it('should reject too small strings', async () => {
      const schema = z.base64({ min: 100 });
      expect(() => schema.parse('dGVzdA==')).to.throw(z.ZodError);
    });
    it('should reject too long strings', async () => {
      const schema = z.base64({ max: 3 });
      expect(() => schema.parse('dGVzdA==')).to.throw(z.ZodError);
    });

    it('should reject invalid raw lengths', async () => {
      const schema = z.base64({ rawLength: 5 });
      expect(() => schema.parse('dGVzdA==')).to.throw(z.ZodError);
    });
  });
});
