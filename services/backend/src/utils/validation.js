const config = require('config');
const { z } = require('zod');
const crypto = require('@lucaapp/crypto');
const validator = require('validator');
const parsePhoneNumber = require('libphonenumber-js/max');

const SAFE_CHARACTERS_REGEX = /^[\w !&+./:@`|£À-ÿāăąćĉċčđēėęěĝğģĥħĩīįİıĵķĸĺļłńņōőœŗřśŝşšţŦũūŭůűųŵŷźżžơưếệ–-]*$/i;
const NO_HTTP_REGEX = /^((?!http).)*$/i;

const PASSWORD_REQUIREMENTS = {
  minLength: 9,
  minNumbers: 1,
  minLowercase: 1,
  minUppercase: 1,
  minSymbols: 1,
};

z.safeString = () =>
  z.string().regex(SAFE_CHARACTERS_REGEX).regex(NO_HTTP_REGEX);

z.phoneNumber = () =>
  z
    .string()
    .max(32)
    .refine(value => !!parsePhoneNumber(value, 'DE')?.isValid(), {
      message: 'invalid phonenumber',
    });

z.strongPassword = () =>
  z
    .string()
    .refine(value => validator.isStrongPassword(value, PASSWORD_REQUIREMENTS));

z.supportedLanguage = () => z.union([z.literal('de'), z.literal('en')]);
z.uuid = () =>
  z
    .string()
    .length(36)
    .refine(value => validator.isUUID(value, 'all'));

z.zipCode = () =>
  z
    .string()
    .max(255)
    .refine(value => validator.isPostalCode(value, 'any'));

z.email = () =>
  z
    .string()
    .email()
    .max(255)
    .refine(value =>
      validator.isEmail(value, {
        allow_display_name: false,
        require_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true,
        allow_ip_domain: false,
        domain_specific_validation: true,
        // double escape  as this is passed into new RegExp("[${blacklisted_chars}]")
        blacklisted_chars: "=',\\\\",
      })
    );

z.integerString = () =>
  z
    .string()
    .max(17)
    .refine(value =>
      validator.isInt(value, {
        lt: Number.MAX_SAFE_INTEGER,
        gt: Number.MIN_SAFE_INTEGER,
        allow_leading_zeroes: false,
      })
    )
    .transform(value => Number.parseInt(value, 10));

z.unixTimestamp = () => z.number().int().positive();

z.base64 = ({ min, max, length, rawLength } = {}) =>
  z
    .string()
    .min(min)
    .max(max)
    .length(length)
    .refine(value => {
      if (!validator.isBase64(value)) return false;
      if (!rawLength) return true;
      return crypto.base64ToBytes(value).length === rawLength;
    });

z.ecPublicKey = () => z.base64({ length: 88, rawLength: 65 });
z.ecCompressedPublicKey = () => z.base64({ length: 44, rawLength: 33 });
z.ecSignature = () => z.base64({ max: 120 });
z.iv = () => z.base64({ length: 24, rawLength: 16 });
z.mac = () => z.base64({ length: 44, rawLength: 32 });
z.traceId = () => z.base64({ length: 24, rawLength: 16 });

z.dailyKeyId = () =>
  z
    .number()
    .int()
    .min(0)
    .max(config.get('keys.daily.max') - 1);

z.badgeKeyId = () =>
  z.number().int().min(0).max(config.get('keys.badge.targetKeyId'));

module.exports = { z };
