import faker from 'faker';
import {
  KDF_SHA256,
  bytesToHex,
  encodeUtf8,
  HMAC_SHA256,
  hexToBase64,
  ENCRYPT_AES_CTR,
  GET_RANDOM_BYTES,
  SIGN_EC_SHA256_DER,
  EC_KEYPAIR_GENERATE,
} from '@lucaapp/crypto';

import { WEBAPP_ROUTE } from './routes';
import {
  connect,
  USER_DATA_SECRET,
  USER_ID,
  USER_SECRET_PRIVATE_KEY,
  USER_SECRET_PUBLIC_KEY,
} from './database';

export async function registerDevice() {
  return new Cypress.Promise(async (resolve, reject) => {
    try {
      cy.visit(`${WEBAPP_ROUTE}/setup`);
      const userKeyPair = EC_KEYPAIR_GENERATE();
      const userDataSecret = GET_RANDOM_BYTES(16);
      const encryptionKey = KDF_SHA256(userDataSecret, '01').slice(0, 32);
      const authenticationKey = KDF_SHA256(userDataSecret, '02');
      const iv = GET_RANDOM_BYTES(16);

      const lastName = faker.name.lastName();
      const firstName = faker.name.firstName();
      const phoneNumber = faker.phone.phoneNumber();
      const email = faker.internet.email();
      const street = faker.address.streetName();
      const houseNumber = faker.address.streetAddress();
      const zip = faker.address.zipCode();
      const city = faker.address.city();
      const payload = {
        v: 3,
        fn: firstName,
        ln: lastName,
        pn: phoneNumber,
        e: email,
        st: street,
        hn: houseNumber,
        pc: zip,
        c: city,
      };
      const buffer = bytesToHex(encodeUtf8(JSON.stringify(payload)));
      const encryptedData = ENCRYPT_AES_CTR(buffer, encryptionKey, iv);
      const mac = HMAC_SHA256(encryptedData, authenticationKey);
      const signature = SIGN_EC_SHA256_DER(
        userKeyPair.privateKey,
        `${encryptedData}${mac}${iv}`
      );

      const { userId } = await fetch('https://localhost/api/v3/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          iv: hexToBase64(iv),
          mac: hexToBase64(mac),
          data: hexToBase64(encryptedData),
          signature: hexToBase64(signature),
          publicKey: hexToBase64(userKeyPair.publicKey),
        }),
      }).then(response => response.json());
      const db = await connect();
      const transaction = db.transaction(['users', 'secrets'], 'readwrite');
      const userObjectStore = transaction.objectStore('users');
      const secretsObjectStore = transaction.objectStore('secrets');

      userObjectStore.put({
        firstName,
        lastName,
        phoneNumber,
        email,
        street,
        houseNumber,
        zip,
        city,
        userId,
        version: 3,
      });
      secretsObjectStore.put({
        type: USER_ID,
        key: userId,
      });
      secretsObjectStore.put({
        type: USER_DATA_SECRET,
        key: userDataSecret,
      });
      secretsObjectStore.put({
        type: USER_SECRET_PUBLIC_KEY,
        key: userKeyPair.publicKey,
      });
      secretsObjectStore.put({
        type: USER_SECRET_PRIVATE_KEY,
        key: userKeyPair.privateKey,
      });

      transaction.oncomplete = () => resolve;
    } catch {
      reject();
    }
  });
}
