import { base64ToHex, EC_KEYPAIR_FROM_PRIVATE_KEY } from '@lucaapp/crypto';
import { storeHealthDepartmentPrivateKeys } from 'utils/cryptoKeyOperations';
import { parsePrivateKeyFile } from 'utils/privateKey';
import { MAX_PRIVATE_KEY_FILE_SIZE } from 'constants/valueLength';

const ERROR_MESSAGE = {
  FILE_TO_BIG: 'FILE_TO_BIG',
  FILE_SUCCESS: 'FILE_SUCCESS',
  FILE_ERROR: 'FILE_ERROR',
};

function loadKeyFile(string, keysData) {
  try {
    const keys = JSON.parse(string);
    if (
      base64ToHex(keysData.publicHDEKP) !==
      EC_KEYPAIR_FROM_PRIVATE_KEY(keys.hdekp).publicKey
    ) {
      throw new Error('invalid key');
    }
    storeHealthDepartmentPrivateKeys(keys.hdekp, keys.hdskp);
    return true;
  } catch {
    return false;
  }
}

export function fileHandler(file, privateKeySecret, keysData) {
  return new Promise((resolve, reject) => {
    if (!file) reject(ERROR_MESSAGE.FILE_ERROR);
    if (file.size > MAX_PRIVATE_KEY_FILE_SIZE)
      reject(ERROR_MESSAGE.FILE_TO_BIG);

    const reader = new FileReader();
    reader.addEventListener('load', event => {
      const privateKeyFileParse = parsePrivateKeyFile(
        event.target.result,
        privateKeySecret
      );
      if (loadKeyFile(privateKeyFileParse, keysData)) {
        resolve(ERROR_MESSAGE.FILE_SUCCESS);
      } else {
        reject(ERROR_MESSAGE.FILE_ERROR);
      }
    });
    reader.readAsText(file);
  });
}
