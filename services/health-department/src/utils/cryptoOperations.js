import argon2 from 'argon2-browser';

import {
  createLocationTransfer,
  createUserTransfer,
  getCurrentDailyKey,
  getEncryptedUserContactData,
  getUserTraces,
  getUserTransferById,
  getUserTransferByTan,
} from 'network/api';

import {
  base32CrockfordToHex,
  base64ToHex,
  bytesToHex,
  bytesToUint8Array,
  decodeUtf8,
  DECRYPT_AES_CTR,
  DECRYPT_DLIES,
  ENCRYPT_DLIES,
  hexToBase64,
  hexToBytes,
  hexToUuid,
  hexToUuid4,
  HKDF_SHA256,
  KDF_SHA256,
} from '@lucaapp/crypto';

import { getDailyPrivateKey } from './cryptoKeyOperations';
import {
  decryptAdditionalData,
  decryptDynamicDeviceTrace,
  decryptStaticDeviceTrace,
} from './decryption';
import { assertStringOrNumericValues } from './typeAssertions';
import { IncompleteDataError } from '../errors/incompleteDataError';

const STATIC_DEVICE_TYPE = 2;

const ARGON_SALT = 'da3ae5ecd280924e';
const L1_INFO = bytesToHex('badge_crypto_assets');
const L2_INFO = bytesToHex('badge_tracing_assets');
const QR_V3 = 3;
const QR_V4 = 4;

export const EMPTY_HISTORY = 'EMPTY_HISTORY';
export const INVALID_VERSION = 'INVALID_VERSION';
export const DECRYPTION_FAILED = 'DECRYPTION_FAILED';

export const decryptUserTransfer = async userTransferId => {
  // also referred to as guest data transfer object
  const userDataTransferObject = await getUserTransferById(userTransferId);
  const dailyPrivateKey = await getDailyPrivateKey(
    userDataTransferObject.keyId
  );
  const userSecrets = JSON.parse(
    hexToBytes(
      DECRYPT_DLIES(
        dailyPrivateKey,
        base64ToHex(userDataTransferObject.publicKey),
        base64ToHex(userDataTransferObject.data),
        base64ToHex(userDataTransferObject.iv),
        base64ToHex(userDataTransferObject.mac)
      )
    )
  );

  const userId = userSecrets.uid;
  const userDataSecret = base64ToHex(userSecrets.uds);
  const encryptedUserContactData = await getEncryptedUserContactData(userId);

  const { data, iv } = encryptedUserContactData;
  if (!data || !iv) {
    throw new IncompleteDataError(data, iv);
  }
  const userDataEncryptionKey =
    userSecrets.qrv === QR_V4
      ? base64ToHex(userSecrets.uds)
      : KDF_SHA256(userDataSecret, '01').slice(0, 32);

  const userContactData = decodeUtf8(
    hexToBytes(
      DECRYPT_AES_CTR(base64ToHex(data), userDataEncryptionKey, base64ToHex(iv))
    )
  );

  const parsed = JSON.parse(userContactData);
  assertStringOrNumericValues(parsed);
  return parsed;
};

export const decryptTrace = async encryptedTrace => {
  const isStaticDevice = encryptedTrace.deviceType === STATIC_DEVICE_TYPE;

  const { userData, isInvalid } = isStaticDevice
    ? await decryptStaticDeviceTrace(encryptedTrace)
    : await decryptDynamicDeviceTrace(encryptedTrace);

  const additionalData = decryptAdditionalData(encryptedTrace, isInvalid);

  return {
    traceId: encryptedTrace.traceId,
    checkin: encryptedTrace.checkin,
    checkout: encryptedTrace.checkout,
    userData,
    additionalData,
    isInvalid,
  };
};

export const initiateUserTracingProcess = async (tan, lang) => {
  // also referred to as guest data transfer object
  const userDataTransferObject = await getUserTransferByTan(tan);
  const dailyPrivateKey = await getDailyPrivateKey(
    userDataTransferObject.keyId
  );
  if (!dailyPrivateKey) {
    console.error('invalid dailyPrivateKey');
  }

  let userSecrets;
  try {
    userSecrets = JSON.parse(
      hexToBytes(
        DECRYPT_DLIES(
          dailyPrivateKey,
          base64ToHex(userDataTransferObject.publicKey),
          base64ToHex(userDataTransferObject.data),
          base64ToHex(userDataTransferObject.iv),
          base64ToHex(userDataTransferObject.mac)
        )
      )
    );
  } catch {
    return DECRYPTION_FAILED;
  }

  let userTraces;
  switch (userSecrets.v) {
    case 2:
      userTraces = await getUserTraces({
        userId: userSecrets.uid,
        userTracingSecret: userSecrets.uts,
      });
      break;
    case 3:
      userTraces = await getUserTraces({
        userId: userSecrets.uid,
        userTracingSecrets: userSecrets.uts,
      });
      break;
    default:
      return INVALID_VERSION;
  }

  if (userTraces.length === 0) {
    return EMPTY_HISTORY;
  }

  const { tracingProcessId } = await createLocationTransfer({
    locations: userTraces,
    userTransferId: userDataTransferObject.uuid,
    lang,
  });

  return tracingProcessId;
};

const isStaticV3 = serialNumber => {
  return (
    serialNumber.toLowerCase().endsWith('0') ||
    serialNumber.toLowerCase().endsWith('g')
  );
};

const isStaticV4 = serialNumber => {
  return (
    serialNumber.toLowerCase().endsWith('2') ||
    serialNumber.toLowerCase().endsWith('h')
  );
};

export const initiateStaticUserTracingProcess = async (serialNumber, lang) => {
  let userId;
  let userDataSecret;
  let userTracingSecret;
  let qrVersion;

  if (isStaticV3(serialNumber)) {
    qrVersion = QR_V3;
    const entropy = base32CrockfordToHex(serialNumber);

    userDataSecret = KDF_SHA256(entropy, '01');
    const tracingSeed = KDF_SHA256(entropy, '02').slice(0, 32);

    const rawUserId = KDF_SHA256(tracingSeed, '01').slice(0, 32);
    userTracingSecret = KDF_SHA256(tracingSeed, '03').slice(0, 32);

    const hexUserId = `${rawUserId.slice(0, 8)}f${rawUserId.slice(9, 32)}`;
    userId = hexToUuid(hexUserId);
  } else if (isStaticV4(serialNumber)) {
    qrVersion = QR_V4;
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
    userDataSecret = l1.slice(0, 32);
    const tracingSeed = l1.slice(32, 64);

    const l2 = await HKDF_SHA256(tracingSeed, 48, L2_INFO, '');

    const rawUserId = l2.slice(0, 32);
    userTracingSecret = l2.slice(64, 96);

    const hexUserId = hexToUuid4(rawUserId);
    userId = hexToUuid(hexUserId);
  }

  // create user transfer
  const userSecrets = {
    v: 2,
    qrv: qrVersion,
    uid: userId,
    uds: hexToBase64(userDataSecret),
    uts: hexToBase64(userTracingSecret),
  };

  const dailyKey = await getCurrentDailyKey();

  const userTransferData = ENCRYPT_DLIES(
    base64ToHex(dailyKey.publicKey),
    bytesToHex(JSON.stringify(userSecrets))
  );

  const { tan } = await createUserTransfer({
    data: hexToBase64(userTransferData.data),
    iv: hexToBase64(userTransferData.iv),
    mac: hexToBase64(userTransferData.mac),
    publicKey: hexToBase64(userTransferData.publicKey),
    keyId: dailyKey.keyId,
  });

  return initiateUserTracingProcess(tan, lang);
};
