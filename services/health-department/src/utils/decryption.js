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
import { getEncryptedUserContactData } from 'network/api';
import { IncompleteDataError } from 'errors/incompleteDataError';
import { z } from 'zod';
import sjson from 'secure-json-parse';
import { sanitizeObject, sanitizeForCSV } from './sanitizer';
import {
  DECRYPT_DLIES_USING_HDEKP,
  getBadgePrivateKey,
  getDailyPrivateKey,
} from './cryptoKeyOperations';

const userDataSchema = z.object({
  fn: z.string().transform(sanitizeForCSV),
  ln: z.string().transform(sanitizeForCSV),
  pn: z.string().transform(sanitizeForCSV),
  e: z.string().optional().transform(sanitizeForCSV),
  st: z.string().transform(sanitizeForCSV),
  hn: z.string().transform(sanitizeForCSV),
  pc: z.string().transform(sanitizeForCSV),
  c: z.string().transform(sanitizeForCSV),
  vs: z.string().optional(),
  v: z.number(),
});

export const additionalDataSchema = z
  .object({ table: z.number().optional() })
  .catchall(z.string())
  .transform(sanitizeObject);

export const decryptUser = (encryptedUser, encKey) => {
  let userData;
  let isInvalid = false;
  if (!encryptedUser.data || !encryptedUser.iv) {
    throw new IncompleteDataError(encryptedUser.data, encryptedUser.iv);
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
    console.error(`invalid utf8`, error);
  }

  try {
    userData = sanitizeObject(userDataSchema.parse(sjson.parse(decryptedUser)));
  } catch (error) {
    console.error(`invalid json`, error);
    userData = null;
    isInvalid = true;
  }
  return { userData, isInvalid };
};

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
  const { userData, userDataInvalid } = decryptUser(encryptedUser, userDataKey);
  if (userDataInvalid) {
    return { userData, isInvalid: true, isDynamicDevice: false };
  }

  const expectedMac = HMAC_SHA256(
    int32ToHex(encryptedTrace.checkin) + base64ToHex(encryptedTrace.data),
    base64ToHex(userData.vs)
  ).slice(0, 16);

  if (hexToBase64(expectedMac) !== encryptedTrace.verification) {
    console.error(`invalid verification (TraceId: ${encryptedTrace.traceId})`);
    return { userData, isInvalid: true, isDynamicDevice: false };
  }

  return { userData, isInvalid: false, isDynamicDevice: false };
}

export async function decryptDynamicDeviceTrace(encryptedTrace) {
  let privateKey;
  let isInvalid = false;
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
      isDynamicDevice: true,
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

  const { userData, userDataInvalid } = decryptUser(encryptedUser, encKey);
  isInvalid = isInvalid || userDataInvalid;

  return { userData, isInvalid, isDynamicDevice: true };
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
    return sanitizeObject(
      additionalDataSchema.parse(sjson.parse(decryptedAdditionalData))
    );
  } catch (error) {
    console.error(
      `invalid json (additionalData) (TraceId: ${encryptedTrace.traceId})`,
      error
    );
    return null;
  }
}
