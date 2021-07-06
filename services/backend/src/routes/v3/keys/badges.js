/**
 * @overview Provides endpoints allowing for generation, verification and rotation of badge keys
 * https://www.luca-app.de/securityoverview/properties/actors.html#term-Badge
 */
/* eslint-disable max-lines, complexity */
const config = require('config');
const router = require('express').Router();
const moment = require('moment');
const status = require('http-status');
const { Transaction } = require('sequelize');

const {
  base64ToHex,
  int32ToHex,
  VERIFY_EC_SHA256_DER_SIGNATURE,
} = require('@lucaapp/crypto');

const {
  validateSchema,
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');

const database = require('../../../database');
const logger = require('../../../utils/logger');
const {
  requireHealthDepartmentEmployee,
} = require('../../../middlewares/requireUser');

const {
  keyIdParametersSchema,
  rotateSchema,
  rekeySchema,
} = require('./badges.schemas');

const UNABLE_TO_SERIALIZE_ERROR_CODE = '40001';

router.get('/attestation', (request, response) => {
  response.setHeader('Cache-Control', 'max-age=600');
  return response.send({
    publicKeys: config.get(`keys.badge.attestation`),
  });
});

router.get('/targetKeyId', async (request, response) => {
  return response.send({
    targetKeyId: config.get('keys.badge.targetKeyId'),
  });
});

/**
 * Get latest badge public key used for generation of badges. Contact data
 * references are encrypted using this. Only health departments possess the
 * private key
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-badge-keypair
 * @see https://www.luca-app.de/securityoverview/badge/badge_generation.html
 */
router.get('/current', async (request, response) => {
  const badgePublicKey = await database.BadgePublicKey.findOne({
    order: [['createdAt', 'DESC']],
  });

  if (!badgePublicKey) {
    return response.sendStatus(status.NOT_FOUND);
  }

  return response.send({
    keyId: badgePublicKey.keyId,
    publicKey: badgePublicKey.publicKey,
    createdAt: moment(badgePublicKey.createdAt).unix(),
    signature: badgePublicKey.signature,
    issuerId: badgePublicKey.issuerId,
  });
});

/**
 * Get given encrypted private badge key. Only health departments can decrypt it.
 * Used to decipher check-ins
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-badge-keypair
 */
router.get(
  '/encrypted/:keyId',
  requireHealthDepartmentEmployee,
  validateParametersSchema(keyIdParametersSchema),
  async (request, response) => {
    const encryptedBadgePrivateKey = await database.EncryptedBadgePrivateKey.findOne(
      {
        where: {
          keyId: request.params.keyId,
          healthDepartmentId: request.user.departmentId,
        },
      }
    );

    if (!encryptedBadgePrivateKey) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      keyId: encryptedBadgePrivateKey.keyId,
      issuerId: encryptedBadgePrivateKey.issuerId,
      data: encryptedBadgePrivateKey.data,
      iv: encryptedBadgePrivateKey.iv,
      mac: encryptedBadgePrivateKey.mac,
      publicKey: encryptedBadgePrivateKey.publicKey,
      signature: encryptedBadgePrivateKey.signature,
      createdAt: moment(encryptedBadgePrivateKey.createdAt).unix(),
    });
  }
);

/**
 * Determine which health department created a given badge keypair and when
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-badge-keypair
 */
router.get(
  '/encrypted/:keyId/keyed',
  requireHealthDepartmentEmployee,
  validateParametersSchema(keyIdParametersSchema),
  async (request, response) => {
    const encryptedBadgePrivateKeys = await database.EncryptedBadgePrivateKey.findAll(
      {
        where: {
          keyId: request.params.keyId,
        },
      }
    );

    return response.send(
      encryptedBadgePrivateKeys.map(encryptedBadgePrivateKey => ({
        healthDepartmentId: encryptedBadgePrivateKey.healthDepartmentId,
        createdAt: moment(encryptedBadgePrivateKey.createdAt).unix(),
      }))
    );
  }
);

/**
 * Fetch given badge public key used to encrypt contact data references
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-badge-keypair
 * @see https://www.luca-app.de/securityoverview/badge/badge_generation.html#badge-static-badge-gen
 */
router.get(
  '/:keyId',
  validateParametersSchema(keyIdParametersSchema),
  async (request, response) => {
    const badgePublicKey = await database.BadgePublicKey.findByPk(
      request.params.keyId
    );

    if (!badgePublicKey) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      keyId: badgePublicKey.keyId,
      publicKey: badgePublicKey.publicKey,
      createdAt: moment(badgePublicKey.createdAt).unix(),
      signature: badgePublicKey.signature,
      issuerId: badgePublicKey.issuerId,
    });
  }
);

/**
 * Share encrypted private badge keys with other health department. Private keys
 * are encrypted for each health department before being uploaded to the luca server
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-badge-keypair
 */
router.post(
  '/rekey',
  requireHealthDepartmentEmployee,
  validateSchema(rekeySchema, '600kb'),
  async (request, response) => {
    const healthDepartment = await database.HealthDepartment.findByPk(
      request.user.departmentId
    );

    if (!healthDepartment) {
      return response.sendStatus(status.NOT_FOUND);
    }

    // verify signatures of encryptedKeys
    for (const encryptedBadgePrivateKey of request.body
      .encryptedBadgePrivateKeys) {
      const signedData =
        int32ToHex(request.body.keyId) +
        int32ToHex(request.body.createdAt) +
        base64ToHex(encryptedBadgePrivateKey.publicKey);
      const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
        base64ToHex(healthDepartment.publicHDSKP),
        signedData,
        base64ToHex(encryptedBadgePrivateKey.signature)
      );

      if (!isValidSignature) {
        return response.sendStatus(status.FORBIDDEN);
      }
    }

    const encryptedBadgePrivateKeys = request.body.encryptedBadgePrivateKeys.map(
      key => ({
        keyId: request.body.keyId,
        createdAt: moment.unix(request.body.createdAt),
        issuerId: request.user.departmentId,
        healthDepartmentId: key.healthDepartmentId,
        data: key.data,
        iv: key.iv,
        mac: key.mac,
        publicKey: key.publicKey,
        signature: key.signature,
      })
    );

    await Promise.all(
      encryptedBadgePrivateKeys.map(key =>
        database.EncryptedBadgePrivateKey.upsert(key)
      )
    );

    return response.sendStatus(status.OK);
  }
);

/**
 * Rotate the badge keypair, similarly to the daily keypair, ensuring future
 * badges will be generated using this new key
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-badge-keypair
 * @see https://www.luca-app.de/securityoverview/badge/badge_generation.html
 */
router.post(
  '/rotate',
  requireHealthDepartmentEmployee,
  validateSchema(rotateSchema, '600kb'),
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async (request, response) => {
    const healthDepartment = await database.HealthDepartment.findByPk(
      request.user.departmentId
    );

    if (!healthDepartment) {
      return response.sendStatus(status.NOT_FOUND);
    }

    // verify signature of daily key
    const signedBadgeKeyData =
      int32ToHex(request.body.keyId) +
      int32ToHex(request.body.createdAt) +
      base64ToHex(request.body.publicKey);
    const isValidBadgeKeySignature = VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(healthDepartment.publicHDSKP),
      signedBadgeKeyData,
      base64ToHex(request.body.signature)
    );

    if (!isValidBadgeKeySignature) {
      return response.sendStatus(status.FORBIDDEN);
    }

    // verify signatures of encryptedKeys
    for (const encryptedBadgePrivateKey of request.body
      .encryptedBadgePrivateKeys) {
      const signedData =
        int32ToHex(request.body.keyId) +
        int32ToHex(request.body.createdAt) +
        base64ToHex(encryptedBadgePrivateKey.publicKey);
      const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
        base64ToHex(healthDepartment.publicHDSKP),
        signedData,
        base64ToHex(encryptedBadgePrivateKey.signature)
      );

      if (!isValidSignature) {
        return response.sendStatus(status.FORBIDDEN);
      }
    }

    // check createdAt
    const now = moment();
    const createdAt = moment.unix(request.body.createdAt);
    if (moment.duration(now.diff(createdAt)).as('minutes') > 5) {
      return response.sendStatus(status.CONFLICT);
    }

    const transaction = await database.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const badgePublicKey = await database.BadgePublicKey.findOne(
        {
          order: [['createdAt', 'DESC']],
        },
        { transaction }
      );

      // initial keyId should be 0
      if (!badgePublicKey && request.body.keyId !== 0) {
        await transaction.rollback();
        return response.sendStatus(status.CONFLICT);
      }

      // new keyId should +1 the old keyId
      if (badgePublicKey && badgePublicKey.keyId + 1 !== request.body.keyId) {
        await transaction.rollback();
        return response.sendStatus(status.CONFLICT);
      }

      // new key should be equal or below the targetKeyId
      if (
        badgePublicKey &&
        request.body.keyId > config.get('keys.badge.targetKeyId')
      ) {
        await transaction.rollback();
        return response.sendStatus(status.CONFLICT);
      }

      await database.BadgePublicKey.upsert(
        {
          keyId: request.body.keyId,
          publicKey: request.body.publicKey,
          signature: request.body.signature,
          createdAt: moment.unix(request.body.createdAt),
          issuerId: request.user.departmentId,
        },
        { transaction }
      );

      const encryptedBadgePrivateKeys = request.body.encryptedBadgePrivateKeys.map(
        // eslint-disable-next-line sonarjs/no-identical-functions
        key => ({
          keyId: request.body.keyId,
          createdAt: moment.unix(request.body.createdAt),
          issuerId: request.user.departmentId,
          healthDepartmentId: key.healthDepartmentId,
          data: key.data,
          iv: key.iv,
          mac: key.mac,
          publicKey: key.publicKey,
          signature: key.signature,
        })
      );

      await Promise.all(
        encryptedBadgePrivateKeys.map(key =>
          database.EncryptedBadgePrivateKey.upsert(key, { transaction })
        )
      );

      await transaction.commit();
      return response.sendStatus(status.OK);
    } catch (error) {
      await transaction.rollback();
      logger.error(error);

      // Transaction error
      if (
        error &&
        error.parent &&
        error.parent.code === UNABLE_TO_SERIALIZE_ERROR_CODE
      ) {
        return response.sendStatus(status.CONFLICT);
      }
      throw error;
    }
  }
);

module.exports = router;
