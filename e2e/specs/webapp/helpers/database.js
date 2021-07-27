import {WEBAPP_ROUTE} from "./routes";

export const DATABASE_NAME = 'luca';
export const DATABASE_VERSION = 50;

export const USER_ID = 'USER_ID';
export const USER_DATA_SECRET = 'USER_DATA_SECRET';
export const USER_SECRET_PUBLIC_KEY = 'USER_SECRET_PUBLIC_KEY';
export const USER_SECRET_PRIVATE_KEY = 'USER_SECRET_PRIVATE_KEY';

export async function connect() {
  return new Cypress.Promise(
    (resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onerror = reject;
      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
    },
    { log: false }
  );
}

export async function clearDatabase() {
  return new Cypress.Promise(async (resolve, reject) => {
    try {
      cy.visit(WEBAPP_ROUTE);
      const database = await connect();

      const objects = [];
      for (let index = 0; index < database.objectStoreNames.length; index++) {
        objects.push(database.objectStoreNames[index]);
      }

      const transaction = database.transaction(objects, 'readwrite');
      for (const name of objects) {
        transaction.objectStore(name).clear();
      }
      transaction.oncomplete = resolve();
    } catch {
      reject();
    }
  });
}
