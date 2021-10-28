import { Op } from 'sequelize';
import {
  uuidToHex,
  base64ToHex,
  hexToBase64,
  HMAC_SHA256,
  SHA256,
  int8ToHex,
} from '@lucaapp/crypto';
import {
  NotificationChunk,
  LocationTransfer,
  LocationTransferTrace,
  RiskLevel,
  DummyTrace,
} from 'database';
import cache from 'utils/redisCache';
import { DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID } from 'constants/deviceTypes';
import moment from 'moment';
import config from 'config';
import NodeCache from 'node-cache';
import uniq from 'lodash/uniq';

const databaseCache = new NodeCache({
  stdTTL: config.get('luca.notificationChunks.cacheTTL'),
});

// Hex length 32 = 16 bytes
const LAST_SLICE_ID_HASH_HEX_LENGTH = 32;
const NOTIFICATIONS_V4_CACHE_KEY = 'notifications:v4';
const HASH_LENGTH = 12;

const IS_COMPLETED_WARN_LEVEL = 1;

const SCHEMA_VERSION_BYTE = Buffer.alloc(1);
SCHEMA_VERSION_BYTE.writeInt8(1);

const ALGORITHM_TYPE_BYTE = Buffer.alloc(1);
ALGORITHM_TYPE_BYTE.writeInt8(0);

const HASH_LENGTH_BYTE = Buffer.alloc(1);
HASH_LENGTH_BYTE.writeInt8(HASH_LENGTH);

const PADDING_BYTES = Buffer.alloc(5);

export const getBinaryHeaderBuffer = (hash?: string): Buffer => {
  const createdAt = Buffer.allocUnsafe(8);
  createdAt.writeBigUInt64BE(BigInt(moment.now()), 0);
  const lastSlice = hash
    ? Buffer.from(base64ToHex(hash), 'hex')
    : Buffer.alloc(16);

  return Buffer.concat([
    SCHEMA_VERSION_BYTE,
    ALGORITHM_TYPE_BYTE,
    HASH_LENGTH_BYTE,
    createdAt,
    PADDING_BYTES,
    lastSlice,
  ]);
};

const hashWithRiskLevels = (
  traceId: string,
  healthDepartmentId: string,
  riskLevels: number[]
) =>
  riskLevels.map((riskLevelToHash: number) =>
    HMAC_SHA256(
      uuidToHex(healthDepartmentId) + int8ToHex(riskLevelToHash),
      base64ToHex(traceId)
    )
  );

export const generateChunk = async () => {
  const lastChunk = await NotificationChunk.findOne({
    order: [['createdAt', 'DESC']],
  });

  const startTime = lastChunk
    ? lastChunk.createdAt
    : moment()
        .subtract(
          config.get('luca.notificationChunks.initialChunkCoverage'),
          'hours'
        )
        .toDate();

  const completedLocationTransfers = await LocationTransfer.findAll({
    attributes: ['departmentId'],
    include: [
      {
        required: false,
        attributes: ['traceId'],
        model: LocationTransferTrace,
        where: {
          traceId: {
            [Op.not]: null,
          },
          deviceType: [DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID],
        },
      },
    ],
    where: {
      approvedAt: { [Op.gt]: startTime },
    },
  });

  const locationTransfersWithRiskLevels = await LocationTransfer.findAll({
    attributes: ['departmentId'],
    include: [
      {
        required: false,
        attributes: ['traceId'],
        model: LocationTransferTrace,
        where: {
          traceId: {
            [Op.not]: null,
          },
          deviceType: [DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID],
        },
        include: [
          {
            required: true,
            model: RiskLevel,
            where: {
              createdAt: { [Op.gt]: startTime },
            },
          },
        ],
      },
    ],
  });

  const dummyTraces = await DummyTrace.findAll({
    attributes: ['healthDepartmentId', 'traceId'],
    // @ts-ignore - any until models are typed
    where: { updatedAt: { [Op.gt]: startTime } },
  });

  const completedHashHexStrings: string[] = completedLocationTransfers.flatMap(
    completedLocationTransfer =>
      completedLocationTransfer.LocationTransferTraces!.flatMap(
        completedLocationTransferTrace =>
          hashWithRiskLevels(
            completedLocationTransferTrace.traceId,
            completedLocationTransfer.departmentId,
            [IS_COMPLETED_WARN_LEVEL]
          )
      )
  );

  const riskLevelHashHexStrings: string[] = locationTransfersWithRiskLevels.flatMap(
    locationTransfer =>
      locationTransfer.LocationTransferTraces!.flatMap(
        locationTransferTrace => {
          const riskLevelsToHash = locationTransferTrace.RiskLevels!.map(
            riskLevel => riskLevel.level
          );
          return hashWithRiskLevels(
            locationTransferTrace.traceId,
            locationTransfer.departmentId,
            riskLevelsToHash
          );
        }
      )
  );

  const dummyHashHexStrings: string[] = dummyTraces.flatMap(dummyTrace =>
    hashWithRiskLevels(dummyTrace.traceId, dummyTrace.healthDepartmentId, [
      IS_COMPLETED_WARN_LEVEL,
    ])
  );

  /* eslint-disable unicorn/prefer-spread */
  const hashStrings = completedHashHexStrings
    .concat(riskLevelHashHexStrings)
    .concat(dummyHashHexStrings);
  /* eslint-enable unicorn/prefer-spread */

  hashStrings.sort((a, b) => b.localeCompare(a));
  const uniqueHashStrings = uniq(hashStrings);
  const hashesAsBuffers = uniqueHashStrings.map(hashString =>
    Buffer.from(hashString, 'hex').slice(0, HASH_LENGTH)
  );

  const headerBuffer = getBinaryHeaderBuffer(lastChunk?.hash);
  const hashListBuffer = Buffer.concat(hashesAsBuffers);

  return Buffer.concat([headerBuffer, hashListBuffer]);
};

export const generateActiveChunk = async () => {
  const chunk = await generateChunk();
  cache.set(NOTIFICATIONS_V4_CACHE_KEY, chunk);
};

export const generateArchiveChunk = async () => {
  const chunk = await generateChunk();
  const rawHash = SHA256(chunk.toString('hex'));
  const trimmedBase64Hash = hexToBase64(
    rawHash.slice(0, LAST_SLICE_ID_HASH_HEX_LENGTH)
  );
  await NotificationChunk.create({ chunk, hash: trimmedBase64Hash });
};

export const getActiveChunk = () =>
  cache
    .get(NOTIFICATIONS_V4_CACHE_KEY, true)
    .then(cachedResponse => cachedResponse[0]);

export const getArchivedChunk = async (chunkId: string) => {
  let chunk = databaseCache.get(chunkId);
  if (!chunk) {
    const notificationChunk = await NotificationChunk.findOne({
      where: { hash: chunkId },
      attributes: ['chunk'],
    });
    chunk = notificationChunk?.chunk;
    if (chunk) databaseCache.set(chunkId, chunk);
  }
  return chunk;
};
