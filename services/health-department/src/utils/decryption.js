import { z } from 'zod';
import sjson from 'secure-json-parse';
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

import {
  DECRYPT_DLIES_USING_HDEKP,
  getBadgePrivateKey,
  getDailyPrivateKey,
} from './cryptoKeyOperations';
import { sanitizeObject, sanitizeForCSV } from './sanitizer';

const STATIC_USER_TYPE = 'static';

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

const getEncryptedTraceData = encryptedTrace =>
  encryptedTrace.isHDEncrypted
    ? DECRYPT_DLIES_USING_HDEKP(
        base64ToHex(encryptedTrace.data.publicKey),
        base64ToHex(encryptedTrace.data.data),
        base64ToHex(encryptedTrace.data.iv),
        base64ToHex(encryptedTrace.data.mac)
      )
    : base64ToHex(encryptedTrace.data);

export const additionalDataSchema = z
  .object({
    table: z
      .string()
      .refine(tableNr => tableNr.length && !Number.isNaN(Number(tableNr)))
      .or(z.number())
      .optional(),
  })
  .catchall(z.string())
  .transform(sanitizeObject);

export const decryptUser = (encryptedUser, encKey) => {
  let userData;
  let verificationSecret = null;
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
    verificationSecret = sjson.parse(decryptedUser)?.vs;
  } catch (error) {
    console.error(`invalid json`, error);
    return { userData: null, verificationSecret: null, isInvalid: true };
  }
  return { userData, verificationSecret, isInvalid: false };
};

export async function decryptStaticDeviceTrace(encryptedTrace) {
  try {
    const privateKey = await getBadgePrivateKey(encryptedTrace.keyId);

    const iv = base64ToHex(encryptedTrace.publicKey).slice(0, 32);
    const dhKey = ECDH(privateKey, base64ToHex(encryptedTrace.publicKey));
    let encKey = HMAC_SHA256(dhKey, iv);
    if (encryptedTrace.version === 4) {
      encKey = encKey.slice(0, 32);
    }

    const hdDecryptedData = getEncryptedTraceData(encryptedTrace);

    const traceData = DECRYPT_AES_CTR(hdDecryptedData, encKey, iv);

    const userId = hexToUuid(traceData.slice(0, 32));
    const userDataKey = traceData.slice(32, 64);

    const encryptedUser = await getEncryptedUserContactData(userId);
    const { userData, verificationSecret, isInvalid } = decryptUser(
      encryptedUser,
      userDataKey
    );

    if (isInvalid) {
      return { userData: null, isInvalid: true, isDynamicDevice: false };
    }

    const expectedMac = HMAC_SHA256(
      int32ToHex(encryptedTrace.checkin) + hdDecryptedData,
      base64ToHex(verificationSecret)
    ).slice(0, 16);

    if (hexToBase64(expectedMac) !== encryptedTrace.verification) {
      console.error(
        `invalid verification (TraceId: ${encryptedTrace.traceId})`
      );
      return { userData: null, isInvalid: true, isDynamicDevice: false };
    }

    const userMacCheck = HMAC_SHA256(
      base64ToHex(encryptedUser.data),
      base64ToHex(verificationSecret)
    );

    if (userMacCheck !== base64ToHex(encryptedUser.mac)) {
      console.error('MAC mismatch for decrypted user data');
      return { userData: null, isInvalid: true, isDynamicDevice: false };
    }

    return { userData, isInvalid: false, isDynamicDevice: false };
  } catch (error) {
    console.error('Error in decryptStaticDeviceTrace:', error);
    throw error;
  }
}

export async function decryptDynamicDeviceTrace(encryptedTrace) {
  try {
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
        isDynamicDevice: true,
      };
    }

    const hdDecryptedData = getEncryptedTraceData(encryptedTrace);

    const traceData = DECRYPT_DLIES_WITHOUT_MAC(
      privateKey,
      base64ToHex(encryptedTrace.publicKey),
      hdDecryptedData,
      base64ToHex(encryptedTrace.publicKey).slice(0, 32)
    );

    const userId = hexToUuid(traceData.slice(0, 32));
    const userDataSecret = traceData.slice(32, 64);
    const encryptedUser = await getEncryptedUserContactData(userId);

    const encKey = KDF_SHA256(userDataSecret, '01').slice(0, 32);
    const authKey = KDF_SHA256(userDataSecret, '02');

    const expectedMac = HMAC_SHA256(
      int32ToHex(encryptedTrace.checkin) + hdDecryptedData,
      authKey
    ).slice(0, 16);

    if (hexToBase64(expectedMac) !== encryptedTrace.verification) {
      console.error(
        `invalid verification (TraceId: ${encryptedTrace.traceId})`
      );
      return { userData: null, isInvalid: true, isDynamicDevice: true };
    }
    const userMacCheck = HMAC_SHA256(base64ToHex(encryptedUser.data), authKey);
    if (userMacCheck !== base64ToHex(encryptedUser.mac)) {
      console.error('MAC mismatch for decrypted user data');
      return { userData: null, isInvalid: true, isDynamicDevice: true };
    }

    const { userData, isInvalid } = decryptUser(encryptedUser, encKey);

    if (isInvalid) {
      return { userData: null, isInvalid: true, isDynamicDevice: false };
    }

    if (encryptedUser.deviceType === STATIC_USER_TYPE) {
      console.error(
        'Device type mismatch for encrypted trace and decrypted user data'
      );
      return { userData: null, isInvalid: true, isDynamicDevice: false };
    }

    return {
      userData: { ...userData, uuid: userId },
      isInvalid: false,
      isDynamicDevice: true,
    };
  } catch (error) {
    console.error('Error in decryptDynamicDeviceTrace', error);
    throw error;
  }
}

export function decryptAdditionalData(encryptedTrace, isInvalid) {
  try {
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
  } catch (error) {
    console.error('Error in decryptAdditionalData:', error);
    throw error;
  }
}
