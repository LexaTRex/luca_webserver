/* eslint no-underscore-dangle: 0 */
const config = require('config');
const { parentPort } = require('worker_threads');
const { BloomFilter } = require('bloomit');

const { SHA256, uuidToHex } = require('@lucaapp/crypto');

const FALSE_POSITIVE_RATE = config.get('bloomFilter.falsePositiveRate');

const unregisteredBadgeBloomFilter = async unregisteredBadges => {
  const filter = BloomFilter.create(
    unregisteredBadges.length,
    FALSE_POSITIVE_RATE
  );
  unregisteredBadges.forEach(badge => {
    const uuidSHA256 = SHA256(uuidToHex(badge.uuid));
    filter.add(uuidSHA256);
  });
  return filter.export();
};

parentPort.on('message', async unregisteredBadges => {
  const bloomFilter = await unregisteredBadgeBloomFilter(unregisteredBadges);
  parentPort.postMessage(bloomFilter);
});
