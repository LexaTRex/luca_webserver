const router = require('express').Router();
const status = require('http-status');

const database = require('../../database');
const { generateTAN } = require('../../utils/generators');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const { limitRequestsPerHour } = require('../../middlewares/rateLimit');

const {
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');

const {
  createSchema,
  tanParametersSchema,
  userTransferIdParametersSchema,
} = require('./userTransfers.schemas');

// APP create UserTransfer
router.post(
  '/',
  limitRequestsPerHour(15),
  validateSchema(createSchema),
  async (request, response) => {
    const transfer = await database.UserTransfer.create({
      tan: generateTAN(),
      data: request.body.data,
      iv: request.body.iv,
      mac: request.body.mac,
      publicKey: request.body.publicKey,
      keyId: request.body.keyId,
    });

    response.status(status.CREATED);
    return response.send({
      tan: transfer.tan,
    });
  }
);

// HD get UserTransfer by tan
router.get(
  '/tan/:tan',
  requireHealthDepartmentEmployee,
  validateParametersSchema(tanParametersSchema),
  async (request, response) => {
    const userTransfer = await database.UserTransfer.findOne({
      where: {
        tan: request.params.tan.toUpperCase(),
        departmentId: null,
      },
    });

    if (!userTransfer) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      uuid: userTransfer.uuid,
      data: userTransfer.data,
      iv: userTransfer.iv,
      mac: userTransfer.mac,
      publicKey: userTransfer.publicKey,
      keyId: userTransfer.keyId,
    });
  }
);

// HD get UserTransfer by id
router.get(
  '/:userTransferId',
  requireHealthDepartmentEmployee,
  validateParametersSchema(userTransferIdParametersSchema),
  async (request, response) => {
    const userTransfer = await database.UserTransfer.findOne({
      where: {
        uuid: request.params.userTransferId,
        departmentId: request.user.departmentId,
      },
    });

    if (!userTransfer) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      uuid: userTransfer.uuid,
      data: userTransfer.data,
      iv: userTransfer.iv,
      mac: userTransfer.mac,
      publicKey: userTransfer.publicKey,
      keyId: userTransfer.keyId,
    });
  }
);

module.exports = router;
