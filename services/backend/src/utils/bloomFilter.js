import cache from 'utils/redisCache';

const moment = require('moment');
const { Worker } = require('worker_threads');
const { Op } = require('sequelize');

const logger = require('./logger').default;
const lifecycle = require('./lifecycle');
const { client } = require('./metrics');
const {
  client: redisClient,
  set: redisSet,
  get: redisGet,
} = require('./redis');
const database = require('../database');

const BLOOM_FILTER_BUFFER_KEY = 'BadgeBloomFilterBuffer';
const BLOOM_FILTER_STATE_GENERATING_KEY = 'IsBloomFilterGenerating';
const BLOOM_FILTER_STATE_EMPTY_BADGE_KEY = 'LastEmptyBadgeCount';
const BLOOM_FILTER_STATE_TOTAL_BADGE_KEY = 'LastTotalBadgeCount';

const EXPIRATION_MULTIPLIER_MS = 2;

const worker = new Worker(`${__dirname}/bloomFilter.worker.js`);
worker.unref();
lifecycle.registerShutdownHandler(() => worker.terminate());

const getIsBloomFilterGenerating = () =>
  redisGet(BLOOM_FILTER_STATE_GENERATING_KEY)
    .then(value => value === 'true')
    .catch(() => false);

const getLastEmptyBadgeCount = () =>
  redisGet(BLOOM_FILTER_STATE_EMPTY_BADGE_KEY)
    .then(value => Number.parseInt(value, 10))
    .catch(() => 0);

const getLastTotalBadgeCount = () =>
  redisGet(BLOOM_FILTER_STATE_TOTAL_BADGE_KEY)
    .then(value => Number.parseInt(value, 10))
    .catch(() => 0);

const getEmptyBadgeCount = async () =>
  database.User.count({
    where: {
      deviceType: 'static',
      [Op.or]: [
        {
          data: {
            [Op.eq]: '',
          },
        },
        {
          deletedAt: {
            [Op.not]: null,
          },
        },
      ],
    },
    paranoid: false,
  });

const getUnregisteredBadges = async () =>
  database.User.findAll({
    where: {
      [Op.or]: [
        {
          data: {
            [Op.eq]: '',
          },
        },
        {
          deletedAt: {
            [Op.not]: null,
          },
        },
      ],
      deviceType: 'static',
    },
    attributes: ['uuid'],
    raw: true,
    paranoid: false,
  });

const getTotalBadgeCount = async () =>
  database.User.count({
    where: {
      deviceType: 'static',
    },
    paranoid: false,
  });

const needsToUpdate = async () => {
  const emptyBadgeCount = (await getEmptyBadgeCount()) || 0;
  const totalBadgeCount = (await getTotalBadgeCount()) || 0;

  if (
    (await getLastEmptyBadgeCount()) === emptyBadgeCount &&
    (await getLastTotalBadgeCount()) === totalBadgeCount
  ) {
    return false;
  }
  return true;
};

const updateBloomFilter = async () => {
  if (await getIsBloomFilterGenerating()) {
    logger.info('Bloom filter is currently generating');
    return;
  }
  if (!(await needsToUpdate())) {
    logger.info('Bloom filter is up to date');
    return;
  }

  const emptyBadgeCount = await getEmptyBadgeCount();
  logger.info(`Bloom filter is now generating for ${emptyBadgeCount} badges.`);

  const expirationTime = Math.max(
    moment.duration(1, 'minute').asMilliseconds(),
    EXPIRATION_MULTIPLIER_MS * emptyBadgeCount
  );
  await redisSet(BLOOM_FILTER_STATE_GENERATING_KEY, true, 'PX', expirationTime);
  worker.postMessage(await getUnregisteredBadges());
};

const getBloomFilterAndEtag = () => cache.get(BLOOM_FILTER_BUFFER_KEY, true);

const bloomFilterGenerationTotalCounter = new client.Counter({
  name: 'bloom_filter_generation_duration_seconds_count',
  help: 'Count of bloom filter generation runs.',
});
const bloomFilterGenerationDurationCounter = new client.Counter({
  name: 'bloom_filter_generation_duration_seconds_sum',
  help: 'Sum of bloom filter generation duration.',
});

worker.on('message', async ({ bloomFilterArrayDump, time }) => {
  bloomFilterGenerationTotalCounter.inc();
  bloomFilterGenerationDurationCounter.inc(time / 1000);
  const emptyBadgeCount = await getEmptyBadgeCount();
  const totalBadgeCount = await getTotalBadgeCount();
  const bloomFilterBuffer = Buffer.from(bloomFilterArrayDump);
  cache.set(BLOOM_FILTER_BUFFER_KEY, bloomFilterBuffer);
  redisClient
    .multi()
    .set(BLOOM_FILTER_STATE_GENERATING_KEY, false)
    .set(BLOOM_FILTER_STATE_EMPTY_BADGE_KEY, (emptyBadgeCount || 0).toString())
    .set(BLOOM_FILTER_STATE_TOTAL_BADGE_KEY, (totalBadgeCount || 0).toString())
    .exec();

  logger.info('Bloom filter generated');
});

module.exports = {
  updateBloomFilter,
  getBloomFilterAndEtag,
};
