import etag from 'etag';
import { set as redisSet, get as redisGet } from './redis';

const getDataKey = (key: string) => `cache:data:${key}`;
const getEtagKey = (key: string) => `cache:etag:${key}`;

const cacheEtagStore = new Map();
const cacheDataStore = new Map();

const get = async (key: string, bufferStore = false) => {
  const localEtag = cacheEtagStore.get(key);
  const remoteEtag = await redisGet(getEtagKey(key));
  if (localEtag === remoteEtag) {
    return [cacheDataStore.get(key), localEtag];
  }

  // If the key is passed as buffer the response will also be a buffer.
  const dataKey = bufferStore ? Buffer.from(getDataKey(key)) : getDataKey(key);
  const remoteValue = await redisGet(dataKey);

  cacheDataStore.set(key, remoteValue);
  cacheEtagStore.set(key, remoteEtag);
  return [remoteValue, remoteEtag];
};

const set = (key: string, value: string | Buffer) => {
  const calculatedEtag = etag(value);
  const dataKey = getDataKey(key);

  redisSet(dataKey, value);
  redisSet(getEtagKey(key), calculatedEtag);
  cacheEtagStore.set(key, calculatedEtag);
  cacheDataStore.set(key, value);
};

const cache = { get, set };

module.exports = cache;
