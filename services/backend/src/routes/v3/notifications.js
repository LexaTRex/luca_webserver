const router = require('express').Router();
const { Op } = require('sequelize');
const moment = require('moment');

const {
  uuidToHex,
  base64ToHex,
  hexToBase64,
  HMAC_SHA256,
} = require('@lucaapp/crypto');
const database = require('../../database');

// get hashed traceIds of traced traces
router.get('/traces', async (request, response) => {
  const twoWeeksAgo = moment().subtract(2, 'weeks');

  const healtDepartments = await database.HealthDepartment.findAll({
    attributes: ['uuid', 'name', 'publicHDEKP', 'publicHDSKP'],
    include: {
      model: database.LocationTransfer,
      attributes: ['departmentId'],
      include: {
        attributes: ['traceId'],
        model: database.LocationTransferTrace,
        where: { createdAt: { [Op.gt]: twoWeeksAgo } },
      },
    },
  });

  return response.send(
    healtDepartments
      .map(healtDepartment => ({
        healthDepartment: {
          departmentId: healtDepartment.uuid,
          name: healtDepartment.name,
          publicHDEKP: healtDepartment.publicHDEKP,
          publicHDSKP: healtDepartment.publicHDSKP,
        },
        hashedTraceIds: healtDepartment.LocationTransfers.map(transfer =>
          transfer.LocationTransferTraces.map(trace =>
            hexToBase64(
              HMAC_SHA256(
                base64ToHex(trace.traceId),
                uuidToHex(healtDepartment.uuid)
              ).slice(0, 32)
            )
          )
        ).flat(),
      }))
      .filter(healthDepartment => healthDepartment.hashedTraceIds.length > 0)
  );
});

module.exports = router;
