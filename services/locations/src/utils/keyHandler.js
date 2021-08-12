import { base64ToHex, EC_KEYPAIR_FROM_PRIVATE_KEY } from '@lucaapp/crypto';

import { MAX_PRIVATE_KEY_FILE_SIZE } from 'constants/valueLength';
import { parsePrivateKeyFile } from 'utils/privateKey';

const ERROR_MESSAGE = {
  FILE_TO_BIG: 'FILE_TO_BIG',
  FILE_SUCCESS: 'FILE_SUCCESS',
  FILE_ERROR: 'FILE_ERROR',
};

function processPrivateKey(privateKey, fileData, publicKey, setPrivateKey) {
  try {
    const keyPair = EC_KEYPAIR_FROM_PRIVATE_KEY(privateKey);
    const isKeyCorrect = keyPair?.publicKey === base64ToHex(publicKey);
    if (isKeyCorrect) {
      setPrivateKey(fileData);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function fileHandler(file, privateKeySecret, publicKey, setPrivateKey) {
  return new Promise((resolve, reject) => {
    if (!file) reject(ERROR_MESSAGE.FILE_ERROR);
    if (file.size > MAX_PRIVATE_KEY_FILE_SIZE)
      reject(ERROR_MESSAGE.FILE_TO_BIG);

    const reader = new FileReader();
    reader.addEventListener('load', event => {
      const stringValue = event.target.result;
      const privateKey = parsePrivateKeyFile(stringValue, privateKeySecret);
      if (
        processPrivateKey(privateKey, stringValue, publicKey, setPrivateKey)
      ) {
        resolve(ERROR_MESSAGE.FILE_SUCCESS);
      }
      reject(ERROR_MESSAGE.FILE_ERROR);
    });
    reader.addEventListener('error', () => reject(ERROR_MESSAGE.FILE_ERROR));
    reader.readAsText(file);
  });
}
