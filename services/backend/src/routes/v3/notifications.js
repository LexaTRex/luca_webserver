const router = require('express').Router();
const { Op } = require('sequelize');
const moment = require('moment');
const uniq = require('lodash/uniq');
const shuffle = require('lodash/shuffle');

const {
  uuidToHex,
  base64ToHex,
  hexToBase64,
  HMAC_SHA256,
} = require('@lucaapp/crypto');

const database = require('../../database');
const redis = require('../../utils/redis');

const NOTIFICATIONS_CACHE_KEY = 'cache:notifications';
const NOTIFICATIONS_CACHE_TTL = moment.duration(15, 'minutes');

// get hashed traceIds of traced traces
router.get('/traces', async (request, response) => {
  const cachedResponse = await redis.get(NOTIFICATIONS_CACHE_KEY);
  if (cachedResponse) {
    return response.send(JSON.parse(cachedResponse));
  }

  const twoWeeksAgo = moment().subtract(2, 'weeks');

  const healthDepartments = await database.HealthDepartment.findAll({
    attributes: ['uuid', 'name', 'publicHDEKP', 'publicHDSKP'],
    include: [
      {
        model: database.LocationTransfer,
        attributes: ['departmentId'],
        include: [
          {
            required: false,
            attributes: ['traceId'],
            model: database.LocationTransferTrace,
            where: { createdAt: { [Op.gt]: twoWeeksAgo } },
          },
        ],
      },
      {
        required: false,
        attributes: ['traceId'],
        model: database.DummyTrace,
        where: { createdAt: { [Op.gt]: twoWeeksAgo } },
      },
    ],
  });

  const responseValue = healthDepartments
    .map(healthDepartment => ({
      healthDepartment: {
        departmentId: healthDepartment.uuid,
        name: healthDepartment.name,
        publicHDEKP: healthDepartment.publicHDEKP,
        publicHDSKP: healthDepartment.publicHDSKP,
      },
      hashedTraceIds: shuffle(
        uniq([
          ...healthDepartment.LocationTransfers.flatMap(transfer =>
            transfer.LocationTransferTraces.map(trace => trace.traceId)
          ),
          ...healthDepartment.DummyTraces.map(trace => trace.traceId),
        ])
      ).map(traceId =>
        hexToBase64(
          HMAC_SHA256(
            base64ToHex(traceId),
            uuidToHex(healthDepartment.uuid)
          ).slice(0, 32)
        )
      ),
    }))
    .filter(healthDepartment => healthDepartment.hashedTraceIds.length > 0);

  redis.set(
    NOTIFICATIONS_CACHE_KEY,
    JSON.stringify(responseValue),
    'EX',
    NOTIFICATIONS_CACHE_TTL.asSeconds()
  );

  return response.send(responseValue);
});

module.exports = router;
