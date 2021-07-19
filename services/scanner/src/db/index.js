import Dexie from 'dexie';
import moment from 'moment';

const database = new Dexie('bloomDB');
database
  .version(1)
  .stores({ bloomFilter: 'filterBinary', updateTimestamp: 'timestamp' });

export const loadStoredFilter = () => database.bloomFilter.toArray();
export const loadUpdateTimestamp = () => database.updateTimestamp.toArray();

export const storeFilter = async filterBinary => {
  await database.bloomFilter.clear();
  database.bloomFilter.put({ filterBinary });
};

export const setUpdateTimestamp = async () => {
  await database.updateTimestamp.clear();
  database.updateTimestamp.put({ timestamp: moment().unix() });
};
