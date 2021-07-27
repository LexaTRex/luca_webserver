const router = require('express').Router();
const status = require('http-status');
const { Op } = require('sequelize');

const {
  uuidToHex,
  bytesToHex,
  base64ToHex,
  VERIFY_EC_SHA256_DER_SIGNATURE,
} = require('@lucaapp/crypto');

const database = require('../../database');

const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const { limitRequestsPerHour } = require('../../middlewares/rateLimit');
const {
  createSchema,
  userIdParametersSchema,
  patchSchema,
  deleteSchema,
} = require('./users.schemas');

const STATIC_USER_TYPE = 'static';

/**
 * Creates a new or updates an existing (identified by the given public key)
 * user. Only accepts if the signature of the payload is valid for the public
 * key sent alongside. On success, returns a user id.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_registration.html#registering-to-the-luca-server
 * @see https://www.luca-app.de/securityoverview/processes/guest_registration.html#updating-the-contact-data
 */
router.post(
  '/',
  limitRequestsPerHour('users_post_ratelimit_hour'),
  validateSchema(createSchema),
  async (request, response) => {
    const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(request.body.publicKey),
      base64ToHex(request.body.data) +
        base64ToHex(request.body.mac) +
        base64ToHex(request.body.iv),
      base64ToHex(request.body.signature)
    );

    if (!isValidSignature) {
      return response.sendStatus(status.FORBIDDEN);
    }

    const existingUser = await database.User.findOne({
      where: {
        publicKey: request.body.publicKey,
      },
    });

    if (existingUser && existingUser.deviceType === STATIC_USER_TYPE) {
      return response.sendStatus(status.FORBIDDEN);
    }

    if (existingUser) {
      await existingUser.update({
        data: request.body.data,
        iv: request.body.iv,
        mac: request.body.mac,
        signature: request.body.signature,
      });

      response.status(status.CREATED);
      return response.send({ userId: existingUser.uuid });
    }

    const user = await database.User.create({
      data: request.body.data,
      iv: request.body.iv,
      mac: request.body.mac,
      publicKey: request.body.publicKey,
      signature: request.body.signature,
    });

    response.status(status.CREATED);
    return response.send({ userId: user.uuid });
  }
);

/**
 * Returns the encrypted personal data of a user for the specified id. Is used
 * by the health department to access the user contact information for contact
 * tracing.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_find_contacts.html#process
 */
router.get(
  '/:userId',
  limitRequestsPerHour('users_get_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  validateParametersSchema(userIdParametersSchema),
  async (request, response) => {
    const user = await database.User.findOne({
      where: {
        uuid: request.params.userId,
      },
      paranoid: false,
    });

    if (!user) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const userIsHealthDepartment =
      request.user && request.user.type === 'HealthDepartmentEmployee';

    const userDTO = {
      userId: user.uuid,
      data: user.data,
      iv: user.iv,
      mac: user.mac,
      signature: user.signature,
      publicKey: user.publicKey,
    };

    if (userIsHealthDepartment) {
      return response.send(userDTO);
    }

    if (user.deletedAt) {
      return response.sendStatus(status.GONE);
    }

    if (user.deviceType === STATIC_USER_TYPE) {
      userDTO.data = !!user.data;
      userDTO.iv = null;
      userDTO.mac = null;
    } else {
      userDTO.data = '';
      userDTO.iv = '';
      userDTO.mac = '';
    }

    return response.send(userDTO);
  }
);

/**
 * Updates an existing user for the given user id. Only accepts if the
 * signature of the payload is valid for the stored public key of the
 * user.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_registration.html#updating-the-contact-data
 */
router.patch(
  '/:userId',
  limitRequestsPerHour('users_patch_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  validateParametersSchema(userIdParametersSchema),
  validateSchema(patchSchema),
  async (request, response) => {
    const user = await database.User.findOne({
      where: {
        uuid: request.params.userId,
      },
    });

    if (!user) {
      return response.sendStatus(status.NOT_FOUND);
    }

    // Reject updates of users with static qr codes
    if (user.data && user.deviceType === STATIC_USER_TYPE) {
      return response.sendStatus(status.FORBIDDEN);
    }

    const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(user.publicKey),
      base64ToHex(request.body.data) +
        base64ToHex(request.body.mac) +
        base64ToHex(request.body.iv),
      base64ToHex(request.body.signature)
    );

    if (!isValidSignature) {
      return response.sendStatus(status.FORBIDDEN);
    }

    await user.update({
      data: request.body.data,
      iv: request.body.iv,
      mac: request.body.mac,
      signature: request.body.signature,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

/**
 * Deletes an existing user for the given user id. Only accepts if the
 * signature of the payload is valid for the stored public key of the
 * user.
 */
router.delete(
  '/:userId',
  limitRequestsPerHour('users_delete_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  validateParametersSchema(userIdParametersSchema),
  validateSchema(deleteSchema),
  async (request, response) => {
    const user = await database.User.findOne({
      where: {
        uuid: request.params.userId,
        deviceType: { [Op.or]: { [Op.ne]: STATIC_USER_TYPE, [Op.eq]: null } },
      },
      paranoid: false,
    });

    if (!user) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (user.deletedAt) {
      return response.sendStatus(status.GONE);
    }

    const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(user.publicKey),
      bytesToHex('DELETE_USER') + uuidToHex(user.uuid),
      base64ToHex(request.body.signature)
    );

    if (!isValidSignature) {
      return response.sendStatus(status.FORBIDDEN);
    }

    await user.destroy();
    return response.sendStatus(status.NO_CONTENT);
  }
);

module.exports = router;
