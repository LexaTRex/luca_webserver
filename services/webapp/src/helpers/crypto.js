/* eslint-disable max-lines */

import moment from 'moment';

import {
  addAdditionalDataToTrace,
  checkinTrace,
  checkoutTrace,
  createUser,
  getScanner,
  postUserTransfers,
} from 'network/api';
import { APPLICATION_JSON, CONTENT_TYPE } from 'constants/header';
import { API_PATH, DEVICE_TYPE, VERSION } from 'constants/environment';
import {
  base64ToHex,
  bytesToHex,
  EC_KEYPAIR_GENERATE,
  ECDH,
  encodeUtf8,
  ENCRYPT_AES_CTR,
  ENCRYPT_DLIES,
  GET_RANDOM_BYTES,
  hexToBase32,
  hexToBase64,
  HMAC_SHA256,
  int32ToHex,
  int8ToHex,
  KDF_SHA256,
  SHA256,
  SIGN_EC_SHA256_DER,
  uuidToHex,
} from '@lucaapp/crypto';

import {
  MAX_CITY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_STREET_LENGTH,
  MAX_POSTAL_CODE_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
} from 'constants/valueLength';
import {
  indexDB,
  USER_DATA_SECRET,
  USER_ID,
  USER_SECRET_PRIVATE_KEY,
  USER_SECRET_PUBLIC_KEY,
  USER_TRACING_SECRET,
} from 'db';

import { getLocation } from './locations';
import { getDailyPublicKey } from './dailyKeys';

/**
 * Returns a user payload
 */
function generateUserPayload({
  firstName,
  lastName,
  phoneNumber,
  email,
  street,
  houseNumber,
  zip,
  city,
} = {}) {
  return {
    v: 3,
    fn: String(firstName).slice(0, MAX_NAME_LENGTH).trim(),
    ln: String(lastName).slice(0, MAX_NAME_LENGTH).trim(),
    pn: String(phoneNumber).slice(0, MAX_PHONE_LENGTH).trim(),
    e: String(email).slice(0, MAX_EMAIL_LENGTH).trim(),
    st: String(street).slice(0, MAX_STREET_LENGTH).trim(),
    hn: String(houseNumber).slice(0, MAX_HOUSE_NUMBER_LENGTH).trim(),
    pc: String(zip).slice(0, MAX_POSTAL_CODE_LENGTH).trim(),
    c: String(city).slice(0, MAX_CITY_LENGTH).trim(),
  };
}

/**
 * Returns the tracing secret for the current day if existing, otherwise generates a
 * fresh one and stores it. Also deletes all tracing secrets outside of the
 * epidemiologically relevant timespan.
 *
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-tracing-secret
 *
 */
export async function getUserTracingSecret() {
  const timestamp = moment().seconds(0);
  const date = timestamp.format('DD-MM-YYYY');

  const userTracingSecrets = await indexDB.userTracingSecret
    .where({ date })
    .toArray();

  if (userTracingSecrets.length === 0) {
    // Generate new user tracing secret for the day
    const secret = GET_RANDOM_BYTES(16);
    await indexDB.userTracingSecret.add({
      date,
      secret,
      createdAt: moment().seconds(0).unix(),
    });

    const last14Days = [timestamp.format('DD-MM-YYYY')];
    for (let index = 0; index < 14; index++) {
      last14Days.push(timestamp.subtract(1, 'days').format('DD-MM-YYYY'));
    }

    indexDB.userTracingSecret.where('date').noneOf(last14Days).delete();
    return secret;
  }

  // Use existing user tracing secret
  return userTracingSecrets[0].secret;
}

export async function getSecrets() {
  const secretMap = {};
  indexDB.secrets.toCollection();

  const secrets = await indexDB.secrets.toCollection().toArray();

  for (const secret of secrets) {
    secretMap[secret.type] = secret.key;
  }

  return { ...secretMap, [USER_TRACING_SECRET]: await getUserTracingSecret() };
}

/**
 * Registers a new user with the server.
 *
 * First generates and stores all required user secrets which are then used to
 * encrypt and authenticate their personal data. Finally, the encrypted and
 * authenticated data is signed and uploaded to the server, which returns a userId
 * that is stored for later use.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_registration.html#creating-the-secrets
 */
export async function registerDevice({
  firstName,
  lastName,
  phoneNumber,
  email,
  street,
  houseNumber,
  zip,
  city,
} = {}) {
  try {
    const userDataSecret = GET_RANDOM_BYTES(16);
    const userKeyPair = EC_KEYPAIR_GENERATE();

    // Register Step
    const encryptionKey = KDF_SHA256(userDataSecret, '01').slice(0, 32);
    const authenticationKey = KDF_SHA256(userDataSecret, '02');
    const iv = GET_RANDOM_BYTES(16);
    const payload = generateUserPayload({
      firstName,
      lastName,
      phoneNumber,
      email,
      street,
      houseNumber,
      zip,
      city,
    });
    const buffer = bytesToHex(encodeUtf8(JSON.stringify(payload)));
    const encryptedData = ENCRYPT_AES_CTR(buffer, encryptionKey, iv);
    const mac = HMAC_SHA256(encryptedData, authenticationKey);
    const signature = SIGN_EC_SHA256_DER(
      userKeyPair.privateKey,
      `${encryptedData}${mac}${iv}`
    );

    const { userId } = await createUser(
      iv,
      mac,
      encryptedData,
      signature,
      userKeyPair.publicKey
    );

    await indexDB.users.add({
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
      useWebApp: true,
    });
    await indexDB.secrets.bulkAdd([
      {
        type: USER_ID,
        key: userId,
      },
      {
        type: USER_DATA_SECRET,
        key: userDataSecret,
      },
      {
        type: USER_SECRET_PUBLIC_KEY,
        key: userKeyPair.publicKey,
      },
      {
        type: USER_SECRET_PRIVATE_KEY,
        key: userKeyPair.privateKey,
      },
    ]);

    return true;
  } catch {
    return false;
  }
}

/**
 * Computes the data to be included in the QR code for a check-in.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#qr-code-generation-and-check-in
 * @param userId - the userId obtained by registering with the server
 */
export async function generateQRCodeData(userId) {
  const secrets = await getSecrets();
  const userDataSecret = secrets[USER_DATA_SECRET];
  const userTracingSecret = secrets[USER_TRACING_SECRET];
  const { keyId, publicKey } = await getDailyPublicKey();

  const timestamp = moment().seconds(0).unix();
  const traceId = HMAC_SHA256(
    `${uuidToHex(userId)}${int32ToHex(timestamp)}`,
    userTracingSecret
  ).slice(0, 32);
  const ephemeralKeyPair = EC_KEYPAIR_GENERATE();

  const dhKey = ECDH(ephemeralKeyPair.privateKey, base64ToHex(publicKey));
  const encryptionKey = KDF_SHA256(dhKey, '01').slice(0, 32);
  const authenticationKey = KDF_SHA256(userDataSecret, '02');
  const iv = ephemeralKeyPair.compressedPublicKey.slice(0, 32);
  const encryptionData = ENCRYPT_AES_CTR(
    `${uuidToHex(userId)}${userDataSecret}`,
    encryptionKey,
    iv
  );

  const verificationTag = HMAC_SHA256(
    `${int32ToHex(timestamp)}${encryptionData}`,
    authenticationKey
  ).slice(0, 16);
  const checksum = SHA256(
    `${VERSION}${DEVICE_TYPE}${int8ToHex(keyId)}${int32ToHex(
      timestamp
    )}${traceId}${encryptionData}${
      ephemeralKeyPair.compressedPublicKey
    }${verificationTag}`
  ).slice(0, 8);

  return {
    keyId,
    timestamp,
    traceId,
    encryptionData,
    ephemeralKeyPair,
    verificationTag,
    checksum,
  };
}

export async function generateQRCode(userId) {
  const {
    keyId,
    timestamp,
    traceId,
    encryptionData,
    ephemeralKeyPair,
    verificationTag,
    checksum,
  } = await generateQRCodeData(userId);

  const qrData = `${VERSION}${DEVICE_TYPE}${int8ToHex(keyId)}${int32ToHex(
    timestamp
  )}${traceId}${encryptionData}${
    ephemeralKeyPair.compressedPublicKey
  }${verificationTag}${checksum}`;

  return hexToBase32(qrData);
}

/**
 * Performs a checkout for the specified traceId.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_checkout.html#checkout-process
 * @param {*} traceId - base64 encoded traceId of the corresponding check-in
 * @param {*} timestamp - checkout time (if empty, the current time is used)
 */
export async function checkout(traceId, timestamp = moment().unix()) {
  const { status } = await checkoutTrace(traceId, timestamp);

  indexDB.history.where({ traceId }).modify({
    checkout: timestamp,
  });

  return status === 204;
}

/**
 * Associates additional data to a check-in. The data is encrypted using the location
 * public key.
 *
 * @see https://www.luca-app.de/securityoverview/processes/additional_data.html
 */
export async function addAdditionalData(traceId, locationId, data) {
  if (typeof data !== 'object') {
    return;
  }

  const formattedData = {};
  for (const additionalDataKey of Object.key(data || {})) {
    formattedData[String(additionalDataKey).trim()] = String(
      data[additionalDataKey]
    ).trim();
  }

  const buffer = bytesToHex(encodeUtf8(JSON.stringify(formattedData)));

  const { publicKey: locationPublicKey } = await getLocation(locationId);

  const { publicKey, data: encryptedData, iv, mac } = ENCRYPT_DLIES(
    base64ToHex(locationPublicKey),
    buffer
  );

  await addAdditionalDataToTrace(iv, mac, traceId, encryptedData, publicKey);
}

/**
 * Performs a self check-in via a printed QR code.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_self_checkin.html#check-in-via-the-guest-app
 * @param scannerId - the scannerId included in the scanned QR code
 * @param additionalData - the additional data included in the scanned QR code (if any)
 */
export async function checkin(scannerId, additionalData = null) {
  const scanner = await getScanner(scannerId);
  await getLocation(scanner.locationId);
  const [{ userId }] = await indexDB.users.toArray();

  const {
    keyId,
    timestamp,
    traceId,
    encryptionData,
    ephemeralKeyPair,
    verificationTag,
  } = await generateQRCodeData(userId);

  const data = `${int8ToHex(VERSION)}${int8ToHex(keyId)}${
    ephemeralKeyPair.compressedPublicKey
  }${verificationTag}${encryptionData}`;

  const { publicKey, data: encryptedCheckinData, iv, mac } = ENCRYPT_DLIES(
    base64ToHex(scanner.publicKey),
    data
  );

  await checkinTrace(
    scannerId,
    traceId,
    timestamp,
    encryptedCheckinData,
    iv,
    mac,
    publicKey
  );

  if (additionalData !== null) {
    await addAdditionalData(traceId, scanner.locationId, additionalData);
    try {
      await indexDB.locations
        .where({ locationId: scanner.locationId })
        .modify({ additionalData });
    } catch (error) {
      console.error(error);
    }
  }

  await indexDB.history
    .add({
      checkout: null,
      checkin: timestamp,
      traceId: hexToBase64(traceId),
      locationId: scanner.locationId,
    })
    .catch(() => {});

  return hexToBase64(traceId);
}

/**
 * Updates user data on the server.
 *
 * Encrypts and authenticates the updated personal data, then signs it with the
 * private key of the user and uploads it to the server.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_registration.html#updating-the-contact-data
 *
 * @param userId - the userId obtained by registering with the server
 * @param userData - the new userData
 */
export async function changeUserInformation(
  userId,
  { firstName, lastName, phoneNumber, email, street, houseNumber, zip, city }
) {
  const secrets = await getSecrets();
  const userDataSecret = secrets[USER_DATA_SECRET];
  const userPrivateKey = secrets[USER_SECRET_PRIVATE_KEY];

  // Change Step
  const encryptionKey = KDF_SHA256(userDataSecret, '01').slice(0, 32);
  const authenticationKey = KDF_SHA256(userDataSecret, '02');
  const iv = GET_RANDOM_BYTES(16);

  const payload = generateUserPayload({
    firstName,
    lastName,
    phoneNumber,
    email,
    street,
    houseNumber,
    zip,
    city,
  });

  const buffer = bytesToHex(encodeUtf8(JSON.stringify(payload)));
  const encryptedData = ENCRYPT_AES_CTR(buffer, encryptionKey, iv);
  const mac = HMAC_SHA256(encryptedData, authenticationKey);

  const signature = SIGN_EC_SHA256_DER(
    userPrivateKey,
    `${encryptedData}${mac}${iv}`
  );
  const requestPayload = {
    iv: hexToBase64(iv),
    mac: hexToBase64(mac),
    data: hexToBase64(encryptedData),
    signature: hexToBase64(signature),
  };

  const { status } = await fetch(`${API_PATH}/v3/users/${userId}`, {
    method: 'PATCH',
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify(requestPayload),
  });

  if (status !== 204) throw Error;

  await indexDB.users.where({ userId }).modify({
    firstName,
    lastName,
    phoneNumber,
    email,
    street,
    houseNumber,
    zip,
    city,
  });
}

/**
 * Starts a user data transfer in case of infection.
 *
 * The relevant user secrets are encrypted using the daily public key and uploaded
 * to the server. The server returns a transaction number to be shared with the
 * appropriate health department.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html#accessing-the-infected-guest-s-tracing-secrets
 */
export async function reportInfection() {
  const secrets = await getSecrets();
  const userId = secrets[USER_ID];
  const userDataSecret = secrets[USER_DATA_SECRET];

  const userTracingSecrets = [];
  for (let day = 0; day < 14; day++) {
    const date = moment().subtract(day, 'days').format('DD-MM-YYYY');
    // eslint-disable-next-line no-await-in-loop
    const keys = await indexDB.userTracingSecret.where({ date }).toArray();
    if (keys.length === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }

    userTracingSecrets.push({
      ts: keys[0].createdAt,
      s: hexToBase64(keys[0].secret),
    });
  }

  const { keyId, publicKey: dailyPublicKey } = await getDailyPublicKey();

  const payload = bytesToHex(
    JSON.stringify({
      v: 3,
      uid: userId,
      uts: userTracingSecrets,
      uds: hexToBase64(userDataSecret),
    })
  );

  const { publicKey, data: encryptedData, iv, mac } = ENCRYPT_DLIES(
    base64ToHex(dailyPublicKey),
    payload
  );

  const { tan } = await postUserTransfers(
    keyId,
    iv,
    mac,
    encryptedData,
    publicKey
  );

  // 12 chars need to split to 4 char chunks to visualise with '-'
  return tan;
}
