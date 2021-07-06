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

const redis = require('./redis');
const database = require('../database');

const NOTIFICATIONS_CACHE_KEY = 'cache:notifications';
const {
  DEVICE_TYPE_IOS,
  DEVICE_TYPE_ANDROID,
  DEVICE_TYPE_WEBAPP,
} = require('../constants/deviceTypes');

const generateNotifications = async () => {
  const twoWeeksAgo = moment().subtract(2, 'weeks');

  const healthDepartments = await database.HealthDepartment.findAll({
    attributes: ['uuid', 'name', 'publicHDEKP', 'publicHDSKP'],
  });

  const healthDepartmentToTracesMap = new Map(
    healthDepartments.map(healthDepartment => [
      healthDepartment.uuid,
      { dummyTraces: [], locationTransferTraces: [] },
    ])
  );

  const locationTransfers = await database.LocationTransfer.findAll({
    attributes: ['departmentId'],
    include: [
      {
        required: false,
        attributes: ['traceId'],
        model: database.LocationTransferTrace,
        where: {
          traceId: {
            [Op.not]: null,
          },
          deviceType: [
            DEVICE_TYPE_IOS,
            DEVICE_TYPE_ANDROID,
            DEVICE_TYPE_WEBAPP,
          ],
        },
      },
    ],
    where: {
      createdAt: { [Op.gt]: twoWeeksAgo },
      isCompleted: true,
    },
  });

  const dummyTraces = await database.DummyTrace.findAll({
    attributes: ['healthDepartmentId', 'traceId'],
    where: { createdAt: { [Op.gt]: twoWeeksAgo } },
  });

  locationTransfers.forEach(locationTransfer =>
    locationTransfer.LocationTransferTraces.forEach(locationTransferTrace =>
      healthDepartmentToTracesMap
        .get(locationTransfer.departmentId)
        .locationTransferTraces.push(locationTransferTrace.traceId)
    )
  );

  dummyTraces.forEach(dummyTrace =>
    healthDepartmentToTracesMap
      .get(dummyTrace.healthDepartmentId)
      .dummyTraces.push(dummyTrace.traceId)
  );

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
          ...healthDepartmentToTracesMap.get(healthDepartment.uuid)
            .locationTransferTraces,
          ...healthDepartmentToTracesMap.get(healthDepartment.uuid).dummyTraces,
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

  redis.set(NOTIFICATIONS_CACHE_KEY, JSON.stringify(responseValue));
};

const getNotifications = () => redis.get(NOTIFICATIONS_CACHE_KEY);

module.exports = { generateNotifications, getNotifications };
