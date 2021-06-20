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

/**
 * Creates a user transfer in case of infection of a user. Assigns and returns
 * a randomly generated transaction number.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html#accessing-the-infected-guest-s-tracing-secrets
 */
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

/**
 * Returns the user transfer object for the specified tan. The endpoint is
 * only accessible to health department employees.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html#accessing-the-infected-guest-s-tracing-secrets
 */
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

/**
 * Returns a user transfer by id. Required for display in the health
 * department frontend. The endpoint is only accessible to health department
 * employees.
 */
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
