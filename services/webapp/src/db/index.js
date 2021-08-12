import Dexie from 'dexie';
import moment from 'moment';

export const DATA_BASE_NAME = 'luca';
export const indexDB = new Dexie(DATA_BASE_NAME);

export const USER_ID = 'USER_ID';
export const USER_DATA_SECRET = 'USER_DATA_SECRET';
export const USER_TRACING_SECRET = 'USER_TRACING_SECRET';
export const USER_SECRET_PUBLIC_KEY = 'USER_SECRET_PUBLIC_KEY';
export const USER_SECRET_PRIVATE_KEY = 'USER_SECRET_PRIVATE_KEY';

indexDB.version(1).stores({
  secrets: '&type, key',
  dailyKeys: '&date, keyId, publicKey',
  history: 'locationId, checkin, checkout, &traceId',
  locations:
    '&locationId, name, publicKey, radius, lat, lng, city, isBluetoothSupported, lastName, firstName, phone, state, streetName, streetNr, zipCode',
  users:
    '&userId, firstName, lastName, phoneNumber, email, street, houseNumber, zip, city, version',
});

indexDB.version(2).stores({
  guests: '&traceId, locationId, firstName, lastName, checkin, checkout',
  privateLocations:
    '&locationId, scannerId, accessId, privateKey, publicKey, startedAt, endedAt',
  locations:
    '&locationId, name, publicKey, radius, lat, lng, city, isBluetoothSupported, lastName, firstName, phone, state, streetName, streetNr, zipCode, additionalData',
});
indexDB
  .version(2.5)
  .stores({
    history: null,
    historyTemp: 'traceId, locationId, checkin, checkout',
  })
  .upgrade(async transaction => {
    const history = await transaction.history.toArray();
    const temporaryStore = transaction.idbtrans.objectStore('historyTemp');
    history.forEach(historyEntry => temporaryStore.put(historyEntry));
  });
indexDB
  .version(3)
  .stores({
    history: '&traceId, locationId, checkin, checkout',
    historyTemp: null,
  })
  .upgrade(async transaction => {
    const history = await transaction.historyTemp.toArray();
    const temporaryStore = transaction.idbtrans.objectStore('history');
    history.forEach(historyEntry => temporaryStore.put(historyEntry));
  });
indexDB.version(3.1).stores({
  locations:
    '&locationId, name, publicKey, isPrivate, radius, lat, lng, city, isBluetoothSupported, lastName, firstName, phone, state, streetName, streetNr, zipCode, additionalData',
});
indexDB.version(3.2).stores({
  locations:
    '&locationId, name, publicKey, isPrivate, radius, lat, lng, city, lastName, firstName, phone, state, streetName, streetNr, zipCode, additionalData',
});
indexDB
  .version(3.3)
  .stores({
    userTracingSecret: '&date, secret, createdAt',
  })
  .upgrade(async transaction => {
    const tracingSecrets = [];
    const { key: tracingSecret } =
      (
        await transaction
          .table('secrets')
          .where({ type: USER_TRACING_SECRET })
          .toArray()
      )[0] || {};

    if (tracingSecret) {
      for (let index = 0; index < 14; index++) {
        const day = moment().subtract(index, 'days');
        const createdAt = day.seconds(0).unix();
        const date = day.format('DD-MM-YYYY');

        tracingSecrets.push({
          date,
          createdAt,
          secret: tracingSecret,
        });
      }

      await transaction.table('userTracingSecret').bulkAdd(tracingSecrets);
      await transaction
        .table('secrets')
        .where({ type: USER_TRACING_SECRET })
        .delete();
    }
  });
indexDB.version(4).stores({
  covidTests: '&createdAt, type, result, labName, doctorName, jwt',
});
indexDB.version(5).stores({
  users:
    '&userId, firstName, lastName, phoneNumber, email, street, houseNumber, zip, city, useWebApp, version',
});
indexDB
  .version(6)
  .stores({
    covidTests: null,
    users:
      '&userId, firstName, lastName, phoneNumber, email, street, houseNumber, zip, city, useWebApp, lastTermsAndConditionsVersion, version',
  })
  .upgrade(async transaction => {
    const [user] = await transaction.table('users').toArray();
    await transaction
      .table('users')
      .where({ userId: user.userId })
      .modify({ lastTermsAndConditionsVersion: null });
  });
