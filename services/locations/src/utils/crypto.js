import {
  base64ToHex,
  DECRYPT_DLIES,
  ENCRYPT_DLIES,
  hexToBase64,
  hexToBytes,
  hexToInt8,
  decodeUtf8,
} from '@lucaapp/crypto';
import sjson from 'secure-json-parse';

const DATA_FRAME_INFO = {
  VERSION_END: 2,
  KEY_ID_END: 4,
  PUBLIC_KEY_END: 70,
  VERIFICATION_END: 86,
};

export const encryptRawData = (dataRaw, publicKey) => {
  const encData = ENCRYPT_DLIES(base64ToHex(publicKey), dataRaw);
  return {
    data: hexToBase64(encData.data),
    publicKey: hexToBase64(encData.publicKey),
    mac: hexToBase64(encData.mac),
    iv: hexToBase64(encData.iv),
  };
};

const decryptDataRaw = (data, privateKey) =>
  DECRYPT_DLIES(
    privateKey,
    base64ToHex(data.publicKey),
    base64ToHex(data.data),
    base64ToHex(data.iv),
    base64ToHex(data.mac)
  );

const parseDataFrame = decData => ({
  version: hexToInt8(decData.slice(0, DATA_FRAME_INFO.VERSION_END)),
  keyId: hexToInt8(
    decData.slice(DATA_FRAME_INFO.VERSION_END, DATA_FRAME_INFO.KEY_ID_END)
  ),
  publicKey: hexToBase64(
    decData.slice(DATA_FRAME_INFO.KEY_ID_END, DATA_FRAME_INFO.PUBLIC_KEY_END)
  ),
  verification: hexToBase64(
    decData.slice(
      DATA_FRAME_INFO.PUBLIC_KEY_END,
      DATA_FRAME_INFO.VERIFICATION_END
    )
  ),
  data: hexToBase64(
    decData.slice(DATA_FRAME_INFO.VERIFICATION_END, decData.length)
  ),
});

const parseAdditionalDataRaw = additionalDataRaw =>
  sjson.parse(decodeUtf8(hexToBytes(additionalDataRaw)));

export const decryptAdditionalData = (additionalData, privateKey) =>
  parseAdditionalDataRaw(decryptDataRaw(additionalData, privateKey));

export const reencryptAdditionalData = (
  additionalData,
  privateKey,
  publicKey
) => {
  if (additionalData) {
    try {
      const decryptedAdditionaldataRaw = decryptDataRaw(
        additionalData,
        privateKey
      );
      // parse JSON to validate if decryption was successful
      parseAdditionalDataRaw(decryptedAdditionaldataRaw);

      return encryptRawData(decryptedAdditionaldataRaw, publicKey);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error decrypting additional data', error);
    }
  }
  return null;
};

export const decryptTrace = (trace, privateKey) =>
  parseDataFrame(decryptDataRaw(trace, privateKey));
