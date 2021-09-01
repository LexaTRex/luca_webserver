import moment from 'moment';

import {
  int8ToHex,
  HMAC_SHA256,
  hexToBase64,
  base64ToHex,
  int32ToHex,
  bytesToHex,
  KDF_SHA256,
  hexToUuid4,
  HKDF_SHA256,
  ENCRYPT_DLIES,
} from '@lucaapp/crypto';

const L2_INFO = bytesToHex('badge_tracing_assets');

// GENERAL
export const getTraceId = tracingSeed => {
  const now = moment().seconds(0).unix();
  const rawUserId = KDF_SHA256(base64ToHex(tracingSeed), '01').slice(0, 32);
  const userTracingSecret = KDF_SHA256(base64ToHex(tracingSeed), '03').slice(
    0,
    32
  );

  const userId = `${rawUserId.slice(0, 8)}f${rawUserId.slice(9, 32)}`;
  return HMAC_SHA256(userId + int32ToHex(now), userTracingSecret).slice(0, 32);
};

// V3 APP
export const getV3AppCheckinPayload = (scanner, qrData) => {
  const data = `03${int8ToHex(qrData.keyId)}${base64ToHex(
    qrData.publicKey
  )}${base64ToHex(qrData.verificationTag)}${base64ToHex(qrData.data)}`;

  const { publicKey, data: venueEncryptedData, iv, mac } = ENCRYPT_DLIES(
    base64ToHex(scanner.publicKey),
    data
  );

  return {
    traceId: qrData.traceId,
    scannerId: scanner.scannerId,
    timestamp: qrData.timestamp,
    data: hexToBase64(venueEncryptedData),
    iv: hexToBase64(iv),
    mac: hexToBase64(mac),
    publicKey: hexToBase64(publicKey),
    deviceType: qrData.deviceType,
  };
};

// V4 BADGE
export const getV4BadgeRawUserId = async qrData => {
  const l2 = await HKDF_SHA256(
    base64ToHex(qrData.tracingSeed),
    48,
    L2_INFO,
    ''
  );
  return l2.slice(0, 32);
};

export const getV4BadgeCheckinPayload = async (qrData, scanner) => {
  // static qr codes
  const l2 = await HKDF_SHA256(
    base64ToHex(qrData.tracingSeed),
    48,
    L2_INFO,
    ''
  );

  const rawUserId = l2.slice(0, 32);
  const userVerificationSecret = l2.slice(32, 64);
  const userTracingSecret = l2.slice(64, 96);
  const userId = hexToUuid4(rawUserId);

  const now = moment().seconds(0).unix();
  const traceId = HMAC_SHA256(
    userId + int32ToHex(now),
    userTracingSecret
  ).slice(0, 32);

  const verificationTag = HMAC_SHA256(
    int32ToHex(now) + base64ToHex(qrData.data),
    userVerificationSecret
  ).slice(0, 16);

  const encodedData = `04${int8ToHex(qrData.keyId)}${base64ToHex(
    qrData.publicKey
  )}${verificationTag}${base64ToHex(qrData.data)}`;

  const { publicKey, data: venueEncryptedData, iv, mac } = ENCRYPT_DLIES(
    base64ToHex(scanner.publicKey),
    encodedData
  );

  return {
    traceId: hexToBase64(traceId),
    scannerId: scanner.scannerId,
    timestamp: now,
    data: hexToBase64(venueEncryptedData),
    iv: hexToBase64(iv),
    mac: hexToBase64(mac),
    publicKey: hexToBase64(publicKey),
    deviceType: qrData.deviceType,
  };
};
