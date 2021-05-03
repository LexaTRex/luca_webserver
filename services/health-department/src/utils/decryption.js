import {
  base64ToHex,
  decodeUtf8,
  DECRYPT_AES_CTR,
  DECRYPT_DLIES_WITHOUT_MAC,
  ECDH,
  hexToBase64,
  hexToBytes,
  hexToUuid,
  HMAC_SHA256,
  int32ToHex,
  KDF_SHA256,
} from '@lucaapp/crypto';
import { pick } from 'lodash';

import { getEncryptedUserContactData } from 'network/api';
import {
  DECRYPT_DLIES_USING_HDEKP,
  getBadgePrivateKey,
  getDailyPrivateKey,
} from './cryptoKeyOperations';
import {
  assertStringOrNumericValues,
  escapeProblematicCharacters,
} from './typeAssertions';

const staticDeviceDataPropertyNames = [
  'fn',
  'ln',
  'pn',
  'e',
  'st',
  'hn',
  'pc',
  'c',
  'vs',
  'v',
];
const dynamicDevicePropertyNames = [
  'fn',
  'ln',
  'pn',
  'e',
  'st',
  'hn',
  'pc',
  'c',
  'v',
];

function filterTraceData(userData, allowedProperties) {
  const picked = escapeProblematicCharacters(pick(userData, allowedProperties));
  assertStringOrNumericValues(picked);
  return picked;
}

export async function decryptStaticDeviceTrace(encryptedTrace) {
  const privateKey = await getBadgePrivateKey(encryptedTrace.keyId);

  const iv = base64ToHex(encryptedTrace.publicKey).slice(0, 32);
  const dhKey = ECDH(privateKey, base64ToHex(encryptedTrace.publicKey));
  let encKey = HMAC_SHA256(dhKey, iv);
  if (encryptedTrace.version === 4) {
    encKey = encKey.slice(0, 32);
  }
  const traceData = DECRYPT_AES_CTR(
    base64ToHex(encryptedTrace.data),
    encKey,
    iv
  );

  const userId = hexToUuid(traceData.slice(0, 32));
  const userDataKey = traceData.slice(32, 64);

  const encryptedUser = await getEncryptedUserContactData(userId);

  if (!encryptedUser.data) {
    return {};
  }
  const decryptedUser = decodeUtf8(
    hexToBytes(
      DECRYPT_AES_CTR(
        base64ToHex(encryptedUser.data),
        userDataKey,
        base64ToHex(encryptedUser.iv)
      )
    )
  );
  const parsed = JSON.parse(decryptedUser);
  const userData = filterTraceData(parsed, staticDeviceDataPropertyNames);

  const expectedMac = HMAC_SHA256(
    int32ToHex(encryptedTrace.checkin) + base64ToHex(encryptedTrace.data),
    base64ToHex(userData.vs)
  ).slice(0, 16);

  if (hexToBase64(expectedMac) !== encryptedTrace.verification) {
    console.error(`invalid verification (TraceId: ${encryptedTrace.traceId})`);
    return { userData, isInvalid: true };
  }

  return { userData, isInvalid: false };
}

export async function decryptDynamicDeviceTrace(encryptedTrace) {
  let userData;
  let isInvalid = false;
  let privateKey;
  try {
    privateKey = await getDailyPrivateKey(encryptedTrace.keyId);
  } catch (error) {
    console.error(
      `Daily private key error (TraceId: ${encryptedTrace.traceId})`,
      error
    );
    return {
      checkin: encryptedTrace.checkin,
      checkout: encryptedTrace.checkout,
      userData: null,
      isInvalid: true,
    };
  }
  const traceData = DECRYPT_DLIES_WITHOUT_MAC(
    privateKey,
    base64ToHex(encryptedTrace.publicKey),
    base64ToHex(encryptedTrace.data),
    base64ToHex(encryptedTrace.publicKey).slice(0, 32)
  );

  const userId = hexToUuid(traceData.slice(0, 32));
  const userDataSecret = traceData.slice(32, 64);
  const encryptedUser = await getEncryptedUserContactData(userId);

  const encKey = KDF_SHA256(userDataSecret, '01').slice(0, 32);
  const authKey = KDF_SHA256(userDataSecret, '02');

  const expectedMac = HMAC_SHA256(
    int32ToHex(encryptedTrace.checkin) + base64ToHex(encryptedTrace.data),
    authKey
  ).slice(0, 16);

  if (hexToBase64(expectedMac) !== encryptedTrace.verification) {
    console.error(`invalid verification (TraceId: ${encryptedTrace.traceId})`);
    isInvalid = true;
  }
  let decryptedUser = hexToBytes(
    DECRYPT_AES_CTR(
      base64ToHex(encryptedUser.data),
      encKey,
      base64ToHex(encryptedUser.iv)
    )
  );

  try {
    decryptedUser = decodeUtf8(decryptedUser);
  } catch (error) {
    console.error(`invalid utf8 (TraceId: ${encryptedTrace.traceId})`, error);
  }

  try {
    const parsed = JSON.parse(decryptedUser);
    userData = filterTraceData(parsed, dynamicDevicePropertyNames);
  } catch (error) {
    console.error(`invalid json (TraceId: ${encryptedTrace.traceId})`, error);
    userData = null;
    isInvalid = true;
  }
  return { userData, isInvalid };
}

export function decryptAdditionalData(encryptedTrace, isInvalid) {
  if (!encryptedTrace.additionalData || isInvalid) {
    return null;
  }
  let decryptedAdditionalData = hexToBytes(
    DECRYPT_DLIES_USING_HDEKP(
      base64ToHex(encryptedTrace.additionalData.publicKey),
      base64ToHex(encryptedTrace.additionalData.data),
      base64ToHex(encryptedTrace.additionalData.iv),
      base64ToHex(encryptedTrace.additionalData.mac)
    )
  );

  try {
    decryptedAdditionalData = decodeUtf8(decryptedAdditionalData);
  } catch (error) {
    console.error(
      `invalid utf8 (additionalData) (TraceId: ${encryptedTrace.traceId})`,
      error
    );
  }

  try {
    const parsed = JSON.parse(decryptedAdditionalData);
    assertStringOrNumericValues(parsed);
    return escapeProblematicCharacters(parsed);
  } catch (error) {
    console.error(
      `invalid json (additionalData) (TraceId: ${encryptedTrace.traceId})`,
      error
    );
    return null;
  }
}
