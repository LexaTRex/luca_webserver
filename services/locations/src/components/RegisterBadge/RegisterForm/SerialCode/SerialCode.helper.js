import argon2 from 'argon2-browser';
import {
  base32CrockfordToHex,
  hexToBytes,
  hexToUuid4,
  bytesToHex,
  bytesToUint8Array,
  HKDF_SHA256,
  KDF_SHA256,
} from '@lucaapp/crypto';

export const SERIAL_NUMBER_SECTION_LENGTH = 4;

export const getSerialNumberRules = (intl, reference) => [
  () => ({
    validator: (rule, value) => {
      if (reference.current.state.focused) {
        return Promise.resolve();
      }
      if (
        !reference.current.state.focused &&
        (!value || value.length < SERIAL_NUMBER_SECTION_LENGTH)
      ) {
        return Promise.reject(
          intl.formatMessage({
            id: 'registerBadge.serialNumber.error.min',
          })
        );
      }

      return Promise.resolve();
    },
  }),
];

const ARGON_SALT = 'da3ae5ecd280924e';

const L1_INFO = bytesToHex('badge_crypto_assets');
const L2_INFO = bytesToHex('badge_tracing_assets');

const isV3 = serialNumber => {
  return (
    serialNumber.toLowerCase().endsWith('0') ||
    serialNumber.toLowerCase().endsWith('g')
  );
};

const isV4 = serialNumber => {
  return (
    serialNumber.toLowerCase().endsWith('2') ||
    serialNumber.toLowerCase().endsWith('h')
  );
};

const calculateSecretsV3 = serialNumber => {
  const entropy = base32CrockfordToHex(serialNumber);

  const cryptoSeed = KDF_SHA256(entropy, '01');
  const tracingSeed = KDF_SHA256(entropy, '02').slice(0, 32);
  const userDataKey = KDF_SHA256(cryptoSeed, '01').slice(0, 32);
  const rawUserId = KDF_SHA256(tracingSeed, '01').slice(0, 32);
  const privateKey = KDF_SHA256(cryptoSeed, '02');
  const userVerificationSecret = KDF_SHA256(tracingSeed, '02');

  const userId = `${rawUserId.slice(0, 8)}-f${rawUserId.slice(
    9,
    12
  )}-${rawUserId.slice(12, 16)}-${rawUserId.slice(16, 20)}-${rawUserId.slice(
    20,
    32
  )}`;

  return {
    userId,
    userDataKey,
    userVerificationSecret,
    privateKey,
  };
};

const calculateSecretsV4 = async serialNumber => {
  const realSerialNumber = serialNumber
    .toLowerCase()
    .replace(/h$/, 'g')
    .replace(/2$/, '0');
  const entropy = base32CrockfordToHex(realSerialNumber);

  const argon2hash = await argon2.hash({
    pass: bytesToUint8Array(hexToBytes(entropy)),
    salt: ARGON_SALT,
    time: 11,
    mem: 32 * 1024,
    hashLen: 16,
    parallelism: 1,
    type: argon2.ArgonType.Argon2id,
  });

  const seed = argon2hash.hashHex;

  const l1 = await HKDF_SHA256(seed, 64, L1_INFO, '');
  const userDataKey = l1.slice(0, 32);
  const tracingSeed = l1.slice(32, 64);
  const privateKey = l1.slice(64, 128);

  const l2 = await HKDF_SHA256(tracingSeed, 48, L2_INFO, '');

  const rawUserId = l2.slice(0, 32);
  const userVerificationSecret = l2.slice(32, 64);

  const hexUserId = hexToUuid4(rawUserId);
  const userId = `${hexUserId.slice(0, 8)}-${hexUserId.slice(
    8,
    12
  )}-${hexUserId.slice(12, 16)}-${hexUserId.slice(16, 20)}-${rawUserId.slice(
    20,
    32
  )}`;

  return {
    userId,
    userDataKey,
    userVerificationSecret,
    privateKey,
  };
};

export const decodeSerial = serialNumber => {
  if (isV3(serialNumber)) {
    return calculateSecretsV3(serialNumber);
  }
  if (isV4(serialNumber)) {
    return calculateSecretsV4(serialNumber);
  }
  return null;
};
