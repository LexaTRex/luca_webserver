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
  decryptUser,
} from './decryption';
import { sanitizeObject } from './sanitizer';
import { QR_V3, QR_V4 } from '../constants/qrVersion';

const STATIC_DEVICE_TYPE = 2;

const ARGON_SALT = 'da3ae5ecd280924e';
const L1_INFO = bytesToHex('badge_crypto_assets');
const L2_INFO = bytesToHex('badge_tracing_assets');

export const EMPTY_HISTORY = 'EMPTY_HISTORY';
export const INVALID_VERSION = 'INVALID_VERSION';
export const DECRYPTION_FAILED = 'DECRYPTION_FAILED';

/**
 * Decrypts a guest data transfer object using the corresponding daily private
 * key, to obtain the contact data of the guest.
 *
 * @param userTransferId - The id of the user transfer (not the tan)
 * @returns Contact data of the guest
 */
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
  const encryptedUser = await getEncryptedUserContactData(userId);

  const userDataEncryptionKey =
    userSecrets.qrv === QR_V4
      ? base64ToHex(userSecrets.uds)
      : KDF_SHA256(userDataSecret, '01').slice(0, 32);

  const { userData } = decryptUser(encryptedUser, userDataEncryptionKey);

  return userData;
};

/**
 * First decrypts the encrypted data secret and user id attached to a trace
 * (ensuring authenticity), then fetches the corresponding encrypted personal
 * data using the user id and decrypts it by deriving the data key from the
 * data secret. If there is additional data associated with the trace it will
 * also be decrypted.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_find_contacts.html#process
 * @param encryptedTrace - A trace containing an encrypted data secret and user id
 * @returns Decrypted trace with user and additional data
 */
export const decryptTrace = async encryptedTrace => {
  const isStaticDevice = encryptedTrace.deviceType === STATIC_DEVICE_TYPE;

  const { userData, isInvalid } = isStaticDevice
    ? await decryptStaticDeviceTrace(encryptedTrace)
    : await decryptDynamicDeviceTrace(encryptedTrace);

  const additionalData = decryptAdditionalData(encryptedTrace, isInvalid);
  // santize data here

  return {
    traceId: encryptedTrace.traceId,
    checkin: encryptedTrace.checkin,
    checkout: encryptedTrace.checkout,
    userData: sanitizeObject(userData),
    additionalData: sanitizeObject(additionalData),
    isInvalid,
  };
};

/**
 * Starts the process of reconstructing the check-in history of a guest. The
 * guest data transfer object identified by the given tan is fetched and
 * decrypted with the corresponding daily private key. The user tracing secret
 * is then provided to the server to create a location transfer process for
 * all affected check-ins.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html#reconstructing-the-infected-guest-s-check-in-history
 * @param tan - Transaction number provided by the user
 * @param lang - Language of the notification process
 * @returns Id of the tracing process
 */
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

/**
 * Initiates the process of reconstructing the check-in history of a user
 * of a static badge. Requires the badge's serial number and creates a guest
 * data transfer object and tan for the guest. Then continues with the regular
 * initiateUserTracingProcess.
 *
 * @param serialNumber - Serial number of the static badge
 * @param lang - Language of the notification process
 * @returns Id of the tracing process
 */
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
