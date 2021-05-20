import { useCallback, useMemo } from 'react';
import {
  hexToBase64,
  base64ToHex,
  bytesToBase64,
  base64ToBytes,
  DECRYPT_AES_GCM,
  ENCRYPT_AES_GCM,
  GET_RANDOM_BYTES,
} from '@lucaapp/crypto';

// Constants
import { ENCRYPTED_PRIVATE_KEY_SESSION_KEY } from 'constants/storage';

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

export function usePrivateKey(privateKeySecret) {
  const privateKey = useMemo(() => {
    if (!sessionStorage.getItem(ENCRYPTED_PRIVATE_KEY_SESSION_KEY)) {
      return null;
    }

    try {
      const { data: encryptedPrivateKey, tag, iv } = JSON.parse(
        sessionStorage.getItem(ENCRYPTED_PRIVATE_KEY_SESSION_KEY)
      );
      return DECRYPT_AES_GCM(
        base64ToHex(encryptedPrivateKey),
        base64ToHex(tag),
        privateKeySecret,
        base64ToHex(iv)
      );
    } catch {
      return null;
    }
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    sessionStorage.getItem(ENCRYPTED_PRIVATE_KEY_SESSION_KEY),
    privateKeySecret,
  ]);

  const setEncryptedPrivateKey = useCallback(
    fileData => {
      try {
        if (!fileData) {
          sessionStorage.removeItem(ENCRYPTED_PRIVATE_KEY_SESSION_KEY);
          return;
        }

        const payload = JSON.parse(base64ToBytes(fileData));

        if (payload.v !== 2) {
          return;
        }

        sessionStorage.setItem(
          ENCRYPTED_PRIVATE_KEY_SESSION_KEY,
          JSON.stringify(payload)
        );
      } catch {
        const iv = GET_RANDOM_BYTES(32);
        const { encrypted, tag } = ENCRYPT_AES_GCM(
          fileData,
          privateKeySecret,
          iv
        );
        sessionStorage.setItem(
          ENCRYPTED_PRIVATE_KEY_SESSION_KEY,
          JSON.stringify({
            iv: hexToBase64(iv),
            tag: hexToBase64(tag),
            data: hexToBase64(encrypted),
          })
        );
      }
    },
    [privateKeySecret]
  );

  return [privateKey, setEncryptedPrivateKey];
}
