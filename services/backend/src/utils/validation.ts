import config from 'config';
import { z as zod } from 'zod';
import * as crypto from '@lucaapp/crypto';
import validator from 'validator';
import parsePhoneNumber from 'libphonenumber-js/max';
import {
  DEVICE_TYPE_IOS,
  DEVICE_TYPE_ANDROID,
  DEVICE_TYPE_STATIC,
  DEVICE_TYPE_WEBAPP,
  DEVICE_TYPE_FORM,
} from 'constants/deviceTypes';

const SAFE_CHARACTERS_REGEX = /^[\w !&()+,./:@`|£À-ÿāăąćĉċčđēėęěĝğģĥħĩīįİıĵķĸĺļłńņōőœŗřśŝşšţŦũūŭůűųŵŷźżžơưếệ–-]*$/i;
const NO_HTTP_REGEX = /^((?!http).)*$/i;

const PASSWORD_REQUIREMENTS = {
  minLength: 9,
  minNumbers: 1,
  minLowercase: 1,
  minUppercase: 1,
  minSymbols: 1,
};

export const z = {
  ...zod,

  safeString: () =>
    z.string().regex(SAFE_CHARACTERS_REGEX).regex(NO_HTTP_REGEX),

  phoneNumber: () =>
    zod
      .string()
      .max(32)
      .refine(value => !!parsePhoneNumber(value, 'DE')?.isValid(), {
        message: 'invalid phonenumber',
      }),

  strongPassword: () =>
    zod
      .string()
      .refine(value =>
        validator.isStrongPassword(value, PASSWORD_REQUIREMENTS)
      ),

  supportedLanguage: () => z.union([z.literal('de'), z.literal('en')]),

  uuid: () =>
    zod
      .string()
      .length(36)
      .refine(value => validator.isUUID(value, 'all')),

  zipCode: () =>
    zod
      .string()
      .max(255)
      .refine(value => validator.isPostalCode(value, 'any')),

  email: () =>
    zod
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
          // @ts-ignore: double escape  as this is passed into new RegExp("[${blacklisted_chars}]")
          blacklisted_chars: "=',\\\\",
        })
      ),

  integerString: () =>
    zod
      .string()
      .max(17)
      .refine(value =>
        validator.isInt(value, {
          lt: Number.MAX_SAFE_INTEGER,
          gt: Number.MIN_SAFE_INTEGER,
          allow_leading_zeroes: false,
        })
      )
      .transform(value => Number.parseInt(value, 10)),

  unixTimestamp: () => zod.number().int().positive(),

  base64: ({
    min,
    max,
    length,
    rawLength,
  }: {
    min?: number;
    max?: number;
    length?: number;
    rawLength?: number;
  } = {}) =>
    zod
      .string()
      .min(min as number)
      .max(max as number)
      .length(length as number)
      .refine(value => {
        if (!validator.isBase64(value)) return false;
        if (!rawLength) return true;

        return crypto.base64ToBytes(value).length === rawLength;
      }),

  ecPublicKey: () => z.base64({ length: 88, rawLength: 65 }),

  ecCompressedPublicKey: () => z.base64({ length: 44, rawLength: 33 }),

  ecSignature: () => z.base64({ max: 120 }),

  iv: () => z.base64({ length: 24, rawLength: 16 }),

  mac: () => z.base64({ length: 44, rawLength: 32 }),

  traceId: () => z.base64({ length: 24, rawLength: 16 }),

  dailyKeyId: () =>
    zod
      .number()
      .int()
      .min(0)
      .max((config.get('keys.daily.max') as number) - 1),

  badgeKeyId: () =>
    z.number().int().min(0).max(config.get('keys.badge.targetKeyId')),

  deviceType: () =>
    z.union([
      z.literal(DEVICE_TYPE_IOS),
      z.literal(DEVICE_TYPE_ANDROID),
      z.literal(DEVICE_TYPE_STATIC),
      z.literal(DEVICE_TYPE_WEBAPP),
      z.literal(DEVICE_TYPE_FORM),
    ]),
};
