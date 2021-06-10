import moment from 'moment';

import {
  hexToBytes,
  encodeUtf8,
  decodeUtf8,
  base64ToHex,
  hexToBase64,
  DECRYPT_DLIES,
  EC_KEYPAIR_GENERATE,
} from '@lucaapp/crypto';

import { indexDB } from 'db';
import { API_PATH } from 'constants/environment';
import { APPLICATION_JSON, CONTENT_TYPE } from 'constants/header';
import { base64UrlToBytes, bytesToBase64Url } from 'utils/encodings';

import { getLocation } from './locations';
import { checkin as checkinToLocation } from './crypto';

export async function createMeeting() {
  const privateLocationKeyPair = EC_KEYPAIR_GENERATE();
  const { locationId, scannerId, accessId } = await fetch(
    `${API_PATH}/v3/locations/private`,
    {
      method: 'POST',
      headers: {
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      body: JSON.stringify({
        publicKey: hexToBase64(privateLocationKeyPair.publicKey),
      }),
    }
  ).then(response => response.json());

  indexDB.privateLocations.add({
    accessId,
    scannerId,
    locationId,
    endedAt: -1,
    startedAt: moment().unix(),
    publicKey: hexToBase64(privateLocationKeyPair.publicKey),
    privateKey: hexToBase64(privateLocationKeyPair.privateKey),
  });
}

export const checkForActiveHostedPrivateMeeting = () =>
  indexDB.privateLocations.where('endedAt').equals(-1).first();

export async function generateMeetingQRCode(privateLocation) {
  const { scannerId } = privateLocation;
  const [user] = await indexDB.users.toArray();
  return `${
    window.location.origin
  }/webapp/meeting/${scannerId}#${bytesToBase64Url(
    encodeUtf8(
      JSON.stringify({
        ln: user.lastName,
        fn: user.firstName,
      })
    )
  )}`;
}

export async function syncMeeting({ locationId, accessId, privateKey }) {
  const databaseGuestsPromises = [];
  const traces = await fetch(
    `${API_PATH}/v3/locations/traces/${accessId}`
  ).then(response => response.json());

  for (const guest of traces) {
    const { traceId } = guest;
    databaseGuestsPromises.push(
      indexDB.guests
        .where({ traceId })
        .first()
        .catch(() => null)
    );
  }

  const databaseGuests = await Promise.all(databaseGuestsPromises);
  const databaseGuestMap = {};

  for (const databaseGuest of databaseGuests) {
    if (databaseGuest) {
      databaseGuestMap[databaseGuest.traceId] = databaseGuest;
    }
  }

  for (const guest of traces) {
    const { traceId, checkin, checkout } = guest;
    const databaseGuest = databaseGuestMap[traceId];
    if (databaseGuest) {
      if (databaseGuest.checkout === -1 && checkout) {
        indexDB.guests.where({ traceId }).modify({ checkout });
      }
    } else {
      if (!guest.data) return;

      const { data, publicKey, iv, mac } = guest.data;

      const decryptedData = DECRYPT_DLIES(
        base64ToHex(privateKey),
        base64ToHex(publicKey),
        base64ToHex(data),
        base64ToHex(iv),
        base64ToHex(mac)
      );

      const { fn: firstName, ln: lastName } = JSON.parse(
        decodeUtf8(hexToBytes(decryptedData))
      );

      indexDB.guests.add({
        traceId,
        locationId,
        firstName,
        lastName,
        checkin,
        checkout: checkout || -1,
      });
    }
  }
}

export async function checkinToPrivateMeeting(scannerId, hash) {
  const scanner = await fetch(
    `${API_PATH}/v3/scanners/${scannerId}`
  ).then(response => response.json());
  const { fn: firstName, ln: lastName } = JSON.parse(
    decodeUtf8(base64UrlToBytes(hash))
  );
  await getLocation(scanner.locationId, {
    isPrivate: true,
    name: `${firstName} ${lastName}`,
  });
  const [
    { lastName: userLastName, firstName: userFirstName },
  ] = await indexDB.users.toArray();

  return checkinToLocation(scannerId, { fn: userFirstName, ln: userLastName });
}

export async function stopMeeting({ locationId, accessId }) {
  try {
    await fetch(`${API_PATH}/v3/locations/${accessId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
  indexDB.privateLocations
    .where({ locationId })
    .modify({ endedAt: moment().unix() });
}
