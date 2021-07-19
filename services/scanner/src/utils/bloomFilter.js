import { SHA256 } from '@lucaapp/crypto';
import { getBloomFilter } from 'network/api';
import { BloomFilter } from 'bloomit';
import moment from 'moment';

import {
  loadStoredFilter,
  storeFilter,
  loadUpdateTimestamp,
  setUpdateTimestamp,
} from 'db';

let bloomFilter;

export const reloadFilter = async forceServerReload => {
  const twoWeeksAgo = moment().subtract(2, 'weeks');

  const [storedBloomFilter] = await loadStoredFilter();
  const [updateTimestampObject] = await loadUpdateTimestamp();
  const lastHardUpdateTwoWeeksAgo = moment(updateTimestampObject).isBefore(
    twoWeeksAgo
  );

  if (forceServerReload || !storedBloomFilter || lastHardUpdateTwoWeeksAgo) {
    const bloomFilterResponse = await getBloomFilter();
    if (bloomFilterResponse.status !== 200) return;

    const bloomFilterUint8Array = await bloomFilterResponse
      .arrayBuffer()
      .then(buffer => new Uint8Array(buffer));

    storeFilter(bloomFilterUint8Array.buffer);
    bloomFilter = BloomFilter.import(bloomFilterUint8Array);
  } else {
    bloomFilter = BloomFilter.import(
      new Uint8Array(storedBloomFilter.filterBinary)
    );
  }

  if (lastHardUpdateTwoWeeksAgo || !storedBloomFilter) setUpdateTimestamp();
};

export const bloomFilterContainsUUID = uuidHex => {
  const uuidSHA256 = SHA256(uuidHex);
  if (!bloomFilter) return false;
  return bloomFilter.has(uuidSHA256);
};
