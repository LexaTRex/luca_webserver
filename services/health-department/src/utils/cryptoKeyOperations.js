import moment from 'moment';

import {
  getCurrentDailyKey,
  getAllDailyKeys,
  getDailyKeyedList,
  getCurrentBadgeKey,
  getBadgeKeyedList,
  getBadgeTargetKeyId,
  getIssuers,
  sendBadgeKeyRotation,
  sendDailyKeyRotation,
  sendRekeyDailyKeys,
  sendRekeyBadgeKeys,
  getEncryptedDailyPrivateKey,
  getEncryptedBadgePrivateKey,
} from 'network/api';

import {
  SIGN_EC_SHA256_DER,
  EC_KEYPAIR_GENERATE,
  ENCRYPT_DLIES,
  DECRYPT_DLIES,
  int32ToHex,
  base64ToHex,
  hexToBase64,
} from '@lucaapp/crypto';

const MIN_DAILY_KEY_AGE_BEFORE_ROTATION_DAYS = 1;
const MAX_DAILY_KEYS = 28;

export const EMPTY_HISTORY = 'EMPTY_HISTORY';
export const INVALID_VERSION = 'INVALID_VERSION';
export const DECRYPTION_FAILED = 'DECRYPTION_FAILED';

let hdekp;
let hdskp;

export function isHdekpInMemory() {
  return hdekp !== undefined;
}

export const storeHealthDepartmentPrivateKeys = (HDEKP, HDSKP) => {
  hdekp = HDEKP;
  hdskp = HDSKP;
};

export const getDailyPrivateKey = async keyId => {
  const encryptedDailyKey = await getEncryptedDailyPrivateKey(keyId);
  return DECRYPT_DLIES(
    hdekp,
    base64ToHex(encryptedDailyKey.publicKey),
    base64ToHex(encryptedDailyKey.data),
    base64ToHex(encryptedDailyKey.iv),
    base64ToHex(encryptedDailyKey.mac)
  );
};

export function clearPrivateKeys() {
  sessionStorage.clear();
}

export const getBadgePrivateKey = async keyId => {
  const encryptedDailyKey = await getEncryptedBadgePrivateKey(keyId);
  return DECRYPT_DLIES(
    hdekp,
    base64ToHex(encryptedDailyKey.publicKey),
    base64ToHex(encryptedDailyKey.data),
    base64ToHex(encryptedDailyKey.iv),
    base64ToHex(encryptedDailyKey.mac)
  );
};

export const DECRYPT_DLIES_USING_HDEKP = (publicKey, data, iv, mac) => {
  return DECRYPT_DLIES(hdekp, publicKey, data, iv, mac);
};

/**
 * Checks if the daily keypair needs to be refreshed and if so, generates it,
 * signs it with the health department's private key and encrypts the new daily
 * private key for all other health departments individually. Then uploads the
 * new daily public key and the encrypted private keys to the backend.
 *
 * @see https://www.luca-app.de/securityoverview/processes/daily_key_rotation.html#daily-public-key-rotation
 */
export const rotateDailyKeypair = async () => {
  let dailyKey;
  try {
    dailyKey = await getCurrentDailyKey();
  } catch {
    dailyKey = { createdAt: 0, keyId: -1 };
  }

  const currentDailyKeypairAge = moment.duration(
    moment().diff(moment.unix(dailyKey.createdAt))
  );

  if (
    currentDailyKeypairAge.asDays() < MIN_DAILY_KEY_AGE_BEFORE_ROTATION_DAYS
  ) {
    return false;
  }

  const newKeyId = (dailyKey.keyId + 1) % MAX_DAILY_KEYS;
  const createdAt = moment().unix();
  const newDailyKeyPair = EC_KEYPAIR_GENERATE();
  const signature = SIGN_EC_SHA256_DER(
    hdskp,
    int32ToHex(newKeyId) + int32ToHex(createdAt) + newDailyKeyPair.publicKey
  );

  const issuers = await getIssuers();
  const issuersWithHDEKP = issuers.filter(issuer => issuer.publicHDEKP);

  const encryptedDailyPrivateKeys = issuersWithHDEKP.map(issuer => {
    const { publicKey, iv, mac, data } = ENCRYPT_DLIES(
      base64ToHex(issuer.publicHDEKP),
      newDailyKeyPair.privateKey
    );
    const publicKeySignature = SIGN_EC_SHA256_DER(
      hdskp,
      int32ToHex(newKeyId) + int32ToHex(createdAt) + publicKey
    );
    return {
      healthDepartmentId: issuer.issuerId,
      data: hexToBase64(data),
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
      publicKey: hexToBase64(publicKey),
      signature: hexToBase64(publicKeySignature),
    };
  });

  const serverPayload = {
    publicKey: hexToBase64(newDailyKeyPair.publicKey),
    signature: hexToBase64(signature),
    createdAt,
    keyId: newKeyId,
    encryptedDailyPrivateKeys,
  };

  return sendDailyKeyRotation(serverPayload);
};

/**
 * Checks if there are any new health departments for which there exist no
 * encrypted daily private keys yet. If so, encrypts all available signed
 * daily private keys for the relevant health departments and uploads them
 * to the backend.
 *
 * @see https://www.luca-app.de/securityoverview/processes/health_department_registration.html#re-encryption-of-the-daily-keypair
 */
export const rekeyDailyKeypairs = async () => {
  const dailyKeys = await getAllDailyKeys();
  const issuers = await getIssuers();

  const rekeyPromises = dailyKeys.map(async dailyKey => {
    const keyedList = await getDailyKeyedList(dailyKey.keyId);

    const notKeyedIssuers = issuers.filter(
      issuer =>
        issuer.publicHDEKP &&
        !keyedList.some(
          keyed =>
            keyed.healthDepartmentId === issuer.issuerId &&
            keyed.createdAt === dailyKey.createdAt
        )
    );

    if (notKeyedIssuers.length === 0) {
      console.info('all keyed', dailyKey.keyId);
      return;
    }

    let encryptedDailyKey;
    let dailyPrivateKey;
    try {
      encryptedDailyKey = await getEncryptedDailyPrivateKey(dailyKey.keyId);
      dailyPrivateKey = await getDailyPrivateKey(dailyKey.keyId);
    } catch {
      console.info('missing key', dailyKey.keyId);
      return;
    }

    if (dailyKey.createdAt !== encryptedDailyKey.createdAt) {
      console.info('outdated key', dailyKey.keyId);
      return;
    }

    const encryptedDailyPrivateKeys = notKeyedIssuers.map(issuer => {
      const { publicKey, iv, mac, data } = ENCRYPT_DLIES(
        base64ToHex(issuer.publicHDEKP),
        dailyPrivateKey
      );

      const publicKeySignature = SIGN_EC_SHA256_DER(
        hdskp,
        int32ToHex(dailyKey.keyId) + int32ToHex(dailyKey.createdAt) + publicKey
      );

      return {
        healthDepartmentId: issuer.issuerId,
        data: hexToBase64(data),
        iv: hexToBase64(iv),
        mac: hexToBase64(mac),
        publicKey: hexToBase64(publicKey),
        signature: hexToBase64(publicKeySignature),
      };
    });

    const serverPayload = {
      keyId: dailyKey.keyId,
      createdAt: dailyKey.createdAt,
      encryptedDailyPrivateKeys,
    };

    await sendRekeyDailyKeys(serverPayload);
  });
  await Promise.all(rekeyPromises);
};

/**
 * Checks if the badge keypair needs to be refreshed and if so, generates it,
 * signs it with the health department's private key and encrypts the new badge
 * private key for all other health departments individually. Then uploads the
 * new badge public key and the encrypted private keys to the backend.
 */
export const rotateBadgeKeypairs = async () => {
  let currentBadgeKey;
  try {
    currentBadgeKey = await getCurrentBadgeKey();
  } catch {
    currentBadgeKey = { createdAt: 0, keyId: -1 };
  }

  const { targetKeyId } = await getBadgeTargetKeyId();

  if (currentBadgeKey.keyId >= targetKeyId) {
    return false;
  }

  const newKeyId = currentBadgeKey.keyId + 1;
  const createdAt = moment().unix();
  const newBadgeKeyPair = EC_KEYPAIR_GENERATE();
  const signature = SIGN_EC_SHA256_DER(
    hdskp,
    int32ToHex(newKeyId) + int32ToHex(createdAt) + newBadgeKeyPair.publicKey
  );

  const issuers = await getIssuers();
  const issuersWithHDEKP = issuers.filter(issuer => issuer.publicHDEKP);

  const encryptedBadgePrivateKeys = issuersWithHDEKP.map(issuer => {
    const { publicKey, iv, mac, data } = ENCRYPT_DLIES(
      base64ToHex(issuer.publicHDEKP),
      newBadgeKeyPair.privateKey
    );
    const publicKeySignature = SIGN_EC_SHA256_DER(
      hdskp,
      int32ToHex(newKeyId) + int32ToHex(createdAt) + publicKey
    );
    return {
      healthDepartmentId: issuer.issuerId,
      data: hexToBase64(data),
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
      publicKey: hexToBase64(publicKey),
      signature: hexToBase64(publicKeySignature),
    };
  });

  const serverPayload = {
    publicKey: hexToBase64(newBadgeKeyPair.publicKey),
    signature: hexToBase64(signature),
    createdAt,
    keyId: newKeyId,
    encryptedBadgePrivateKeys,
  };

  return sendBadgeKeyRotation(serverPayload);
};

/**
 * Checks if there are any new health departments for which there exist no
 * encrypted badge private key yet. If so, encrypts the current signed
 * badge private key for the relevant health departments and uploads them
 * to the backend.
 */
export const rekeyBadgeKeypairs = async () => {
  const badgeKey = await getCurrentBadgeKey();
  const keyedList = await getBadgeKeyedList(badgeKey.keyId);
  const issuers = await getIssuers();

  const notKeyedIssuers = issuers.filter(
    issuer =>
      issuer.publicHDEKP &&
      !keyedList.some(keyed => keyed.healthDepartmentId === issuer.issuerId)
  );

  if (notKeyedIssuers.length === 0) {
    return;
  }

  let badgePrivateKey;
  try {
    badgePrivateKey = await getBadgePrivateKey(badgeKey.keyId);
  } catch {
    return;
  }

  const encryptedBadgePrivateKeys = notKeyedIssuers.map(issuer => {
    const { publicKey, iv, mac, data } = ENCRYPT_DLIES(
      base64ToHex(issuer.publicHDEKP),
      badgePrivateKey
    );

    const publicKeySignature = SIGN_EC_SHA256_DER(
      hdskp,
      int32ToHex(badgeKey.keyId) + int32ToHex(badgeKey.createdAt) + publicKey
    );

    return {
      healthDepartmentId: issuer.issuerId,
      data: hexToBase64(data),
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
      publicKey: hexToBase64(publicKey),
      signature: hexToBase64(publicKeySignature),
    };
  });

  const serverPayload = {
    keyId: badgeKey.keyId,
    createdAt: badgeKey.createdAt,
    encryptedBadgePrivateKeys,
  };

  sendRekeyBadgeKeys(serverPayload);
};
