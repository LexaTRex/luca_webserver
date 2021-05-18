const router = require('express').Router();
const status = require('http-status');
const config = require('config');
const passport = require('passport');
const { Op } = require('sequelize');

const {
  uuidToHex,
  bytesToHex,
  base64ToHex,
  hexToBase64,
  SIGN_EC_SHA256_IEEE,
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
  badgeCreateSchema,
  userIdParametersSchema,
  patchSchema,
  deleteSchema,
} = require('./users.schemas');

const STATIC_USER_TYPE = 'static';

// create user
router.post(
  '/',
  limitRequestsPerHour(200),
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

// create badge user
router.post(
  '/badge',
  passport.authenticate('bearer-badgeGenerator', { session: false }),
  validateSchema(badgeCreateSchema),
  async (request, response) => {
    const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(request.body.publicKey),
      uuidToHex(request.body.userId) + base64ToHex(request.body.data),
      base64ToHex(request.body.signature)
    );

    if (!isValidSignature) {
      return response.sendStatus(status.FORBIDDEN);
    }

    const existingUser = await database.User.findOne({
      where: {
        uuid: request.body.userId,
      },
    });

    if (existingUser) {
      return response.sendStatus(status.CONFLICT);
    }

    await database.User.create({
      uuid: request.body.userId,
      data: '',
      publicKey: request.body.publicKey,
      deviceType: STATIC_USER_TYPE,
    });

    const signature = SIGN_EC_SHA256_IEEE(
      base64ToHex(config.get('keys.badge.private')),
      uuidToHex(request.body.userId) + base64ToHex(request.body.data)
    );

    return response.send({
      signature: hexToBase64(signature),
    });
  }
);

// get user by id
router.get(
  '/:userId',
  limitRequestsPerHour(1000, { skipSuccessfulRequests: true }),
  validateParametersSchema(userIdParametersSchema),
  async (request, response) => {
    const user = await database.User.findOne(
      {
        where: {
          uuid: request.params.userId,
        },
      },
      { paranoid: false }
    );

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
      return response.sendStatus(status.NOT_FOUND);
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

// update user
router.patch(
  '/:userId',
  limitRequestsPerHour(1000, { skipSuccessfulRequests: true }),
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

// delete user
router.delete(
  '/:userId',
  limitRequestsPerHour(100, { skipSuccessfulRequests: true }),
  validateParametersSchema(userIdParametersSchema),
  validateSchema(deleteSchema),
  async (request, response) => {
    const user = await database.User.findOne({
      where: {
        uuid: request.params.userId,
        deviceType: { [Op.or]: { [Op.ne]: STATIC_USER_TYPE, [Op.eq]: null } },
      },
    });

    if (!user) {
      return response.sendStatus(status.NOT_FOUND);
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
