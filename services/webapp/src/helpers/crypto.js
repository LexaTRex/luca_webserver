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
  KDF_SHA256,
  bytesToHex,
  encodeUtf8,
  GET_RANDOM_BYTES,
  HMAC_SHA256,
  ENCRYPT_AES_CTR,
  SIGN_EC_SHA256_DER,
  VERIFY_EC_SHA256_DER_SIGNATURE,
  hexToBase64,
  int32ToHex,
  uuidToHex,
  ECDH,
  base64ToHex,
  SHA256,
  int8ToHex,
  hexToBase32,
  EC_KEYPAIR_GENERATE,
  ENCRYPT_DLIES,
} from '@lucaapp/crypto';

import {
  indexDB,
  USER_ID,
  USER_DATA_SECRET,
  USER_SECRET_PRIVATE_KEY,
  USER_SECRET_PUBLIC_KEY,
  USER_TRACING_SECRET,
} from 'db';

import { getLocation } from './locations';

export class ExpiredDailyKey extends Error {}
export class InvalidDailyKeySignature extends Error {}

export async function getDailyPublicKey() {
  const date = moment().format('DD-MM-YYYY');
  const keys = await indexDB.dailyKeys.where({ date }).toArray();

  if (keys.length === 0) {
    const { keyId, issuerId, publicKey, signature, createdAt } = await fetch(
      `${API_PATH}/v3/keys/daily/current`
    ).then(response => response.json());

    const { publicHDSKP } = await fetch(
      `${API_PATH}/v3/keys/issuers/${issuerId}`
    ).then(response => response.json());

    const isValidSignature = await VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(publicHDSKP),
      `${int32ToHex(keyId)}${int32ToHex(createdAt)}${base64ToHex(publicKey)}`,
      base64ToHex(signature)
    );

    if (!isValidSignature) {
      throw new InvalidDailyKeySignature('Signature is not valid');
    }

    if (moment.duration(moment().diff(moment.unix(createdAt))).asDays() > 7) {
      throw new ExpiredDailyKey('The current daily key is expired');
    }

    await indexDB.dailyKeys.where('date').notEqual(date).delete();
    await indexDB.dailyKeys.add({ publicKey, date, keyId });
    return { publicKey, keyId };
  }

  const { publicKey, keyId } = keys[0];
  return { publicKey, keyId };
}

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

// traceId needs to be bas64 encoded
export async function checkout(traceId, timestamp = moment().unix()) {
  const { status } = await checkoutTrace(traceId, timestamp);

  indexDB.history.where({ traceId }).modify({
    checkout: timestamp,
  });

  return status === 204;
}

export async function addAdditionalData(traceId, locationId, data) {
  const buffer = bytesToHex(encodeUtf8(JSON.stringify(data)));

  const { publicKey: locationPublicKey } = await getLocation(locationId);

  const { publicKey, data: encryptedData, iv, mac } = ENCRYPT_DLIES(
    base64ToHex(locationPublicKey),
    buffer
  );

  await addAdditionalDataToTrace(iv, mac, traceId, encryptedData, publicKey);
}

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
