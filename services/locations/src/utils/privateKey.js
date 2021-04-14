import {
  hexToBase64,
  base64ToHex,
  bytesToBase64,
  base64ToBytes,
  DECRYPT_AES_GCM,
  ENCRYPT_AES_GCM,
  GET_RANDOM_BYTES,
} from '@lucaapp/crypto';

export function generatePrivateKeyFile(privateKey, privateKeySecret) {
  const iv = GET_RANDOM_BYTES(32);
  const { encrypted, tag } = ENCRYPT_AES_GCM(privateKey, privateKeySecret, iv);
  const payload = {
    iv: hexToBase64(iv),
    tag: hexToBase64(tag),
    data: hexToBase64(encrypted),
    v: 2,
  };
  return bytesToBase64(JSON.stringify(payload));
}
export function parsePrivateKeyFile(fileData, privateKeySecret) {
  try {
    const payload = JSON.parse(base64ToBytes(fileData));

    if (payload.v !== 2) {
      return null;
    }

    return DECRYPT_AES_GCM(
      base64ToHex(payload.data),
      base64ToHex(payload.tag),
      privateKeySecret,
      base64ToHex(payload.iv)
    );
  } catch {
    return fileData;
  }
}
