import {
  bytesToHex,
  hexToBase64,
  bytesToBase64,
  ENCRYPT_AES_GCM,
  GET_RANDOM_BYTES,
  GENERATE_KEY_FROM_SECRET,
} from '@lucaapp/crypto';

export function generatePIN() {
  const randomNumbers = new Int16Array(6);
  crypto.getRandomValues(randomNumbers);
  return randomNumbers
    .map(number => {
      const digits = `${number}`;
      return digits[digits.length - 1];
    })
    .join('');
}

export async function generateTransferQRCodeData(type, data, pin, challengeId) {
  const iv = GET_RANDOM_BYTES(16);
  const salt = GET_RANDOM_BYTES(32);
  const privateKey = await GENERATE_KEY_FROM_SECRET(bytesToHex(pin), salt);

  const { tag, encrypted } = ENCRYPT_AES_GCM(
    bytesToHex(data),
    bytesToHex(privateKey),
    iv
  );

  const qrCode = {
    type,
    challengeId,
    tag: hexToBase64(tag),
    encrypted: hexToBase64(encrypted),
    salt: hexToBase64(salt),
    iv: hexToBase64(iv),
  };

  return bytesToBase64(JSON.stringify(qrCode));
}
