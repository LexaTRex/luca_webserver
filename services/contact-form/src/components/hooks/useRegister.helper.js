import {
  EC_KEYPAIR_GENERATE,
  ECDH,
  HMAC_SHA256,
  KDF_SHA256,
  GET_RANDOM_BYTES,
  hexToBase64,
  SIGN_EC_SHA256_DER,
  base64ToHex,
  bytesToHex,
  encodeUtf8,
  int8ToHex,
  int32ToHex,
  uuidToHex,
  ENCRYPT_AES_CTR,
  ENCRYPT_DLIES,
} from '@lucaapp/crypto';
import {
  MAX_NAME_LENGTH,
  MAX_CITY_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_STREET_LENGTH,
  MAX_POSTAL_CODE_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
} from 'constants/valueLength';

export const getUserIdPayload = (values, userDataSecret, userKeyPair) => {
  const creationData = {
    v: 3,
    fn: String(values.firstName).slice(0, MAX_NAME_LENGTH).trim(),
    ln: String(values.lastName).slice(0, MAX_NAME_LENGTH).trim(),
    pn: String(values.phone).slice(0, MAX_PHONE_LENGTH).trim(),
    e: String(values.email).slice(0, MAX_EMAIL_LENGTH).trim(),
    st: String(values.street).slice(0, MAX_STREET_LENGTH).trim(),
    hn: String(values.number).slice(0, MAX_HOUSE_NUMBER_LENGTH).trim(),
    pc: String(values.zip).slice(0, MAX_POSTAL_CODE_LENGTH).trim(),
    c: String(values.city).slice(0, MAX_CITY_LENGTH).trim(),
  };

  // Convert object to UTF-8 encoded json bytestring
  const payload = bytesToHex(encodeUtf8(JSON.stringify(creationData)));

  const encKey = KDF_SHA256(userDataSecret, '01').slice(0, 32);
  const authKey = KDF_SHA256(userDataSecret, '02');
  const iv = GET_RANDOM_BYTES(16);

  const encData = ENCRYPT_AES_CTR(payload, encKey, iv);
  const mac = HMAC_SHA256(encData, authKey);
  const signature = SIGN_EC_SHA256_DER(
    userKeyPair.privateKey,
    encData + mac + iv
  );

  return {
    data: hexToBase64(encData),
    iv: hexToBase64(iv),
    mac: hexToBase64(mac),
    publicKey: hexToBase64(userKeyPair.publicKey),
    signature: hexToBase64(signature),
  };
};

export const getV3CheckinPayload = (
  userId,
  dailyKey,
  userDataSecret,
  scanner,
  timestamp,
  traceId
) => {
  const qrKeyPair = EC_KEYPAIR_GENERATE();
  const qrIv = qrKeyPair.compressedPublicKey.slice(0, 32);
  const qrDhKey = ECDH(qrKeyPair.privateKey, base64ToHex(dailyKey.publicKey));
  const qrEncKey = KDF_SHA256(qrDhKey, '01').slice(0, 32);
  const userAuthKey = KDF_SHA256(userDataSecret, '02');

  const qrEncData = ENCRYPT_AES_CTR(
    uuidToHex(userId) + userDataSecret,
    qrEncKey,
    qrIv
  );
  const verification = HMAC_SHA256(
    int32ToHex(timestamp) + qrEncData,
    userAuthKey
  ).slice(0, 16);

  const venuePublicKey = base64ToHex(scanner.publicKey);

  const payload = `03${int8ToHex(dailyKey.keyId)}${
    qrKeyPair.compressedPublicKey
  }${verification}${qrEncData}`;

  const { publicKey, data: venueEncData, iv, mac: venueMac } = ENCRYPT_DLIES(
    venuePublicKey,
    payload
  );

  return {
    traceId: hexToBase64(traceId),
    scannerId: scanner.scannerId,
    timestamp,
    data: hexToBase64(venueEncData),
    publicKey: hexToBase64(publicKey),
    iv: hexToBase64(iv),
    mac: hexToBase64(venueMac),
    deviceType: 4,
  };
};

export const getTraceId = (userId, userTracingSecret, timestamp) => {
  return HMAC_SHA256(
    uuidToHex(userId) + int32ToHex(timestamp),
    userTracingSecret
  ).slice(0, 32);
};

export const getAdditionalDataPayload = (scanner, traceId, additionalData) => {
  // Convert object to UTF-8 encoded json bytestring
  const payload = bytesToHex(encodeUtf8(JSON.stringify(additionalData)));

  const { data, iv, mac, publicKey } = ENCRYPT_DLIES(
    base64ToHex(scanner.publicKey),
    payload
  );

  return {
    traceId: hexToBase64(traceId),
    data: hexToBase64(data),
    publicKey: hexToBase64(publicKey),
    iv: hexToBase64(iv),
    mac: hexToBase64(mac),
  };
};
