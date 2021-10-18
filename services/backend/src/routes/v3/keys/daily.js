/**
 * @overview Provides endpoints for retrieving and rotating of daily keys
 *
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-daily-keypair
 * @see https://www.luca-app.de/securityoverview/processes/daily_key_rotation.html
 */
/* eslint-disable max-lines, complexity */
const router = require('express').Router();
const moment = require('moment');
const config = require('config');
const status = require('http-status');
const { Transaction } = require('sequelize');

const {
  base64ToHex,
  int32ToHex,
  VERIFY_EC_SHA256_DER_SIGNATURE,
} = require('@lucaapp/crypto');

const {
  AuditLogEvents,
  AuditStatusType,
} = require('../../../constants/auditLog');
const { logEvent } = require('../../../utils/hdAuditLog');

const {
  validateSchema,
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');

const database = require('../../../database');
const {
  requireHealthDepartmentEmployee,
} = require('../../../middlewares/requireUser');
const {
  limitRequestsByUserPerHour,
} = require('../../../middlewares/rateLimit');

const {
  keyIdParametersSchema,
  rotateSchema,
  rekeySchema,
} = require('./daily.schemas');

const UNABLE_TO_SERIALIZE_ERROR_CODE = '40001';

/**
 * Fetch all the latest daily public keys used to encrypt check-in data
 *
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-daily-keypair
 */
router.get('/', async (request, response) => {
  const dailyPublicKeys = await database.DailyPublicKey.findAll({
    order: [['createdAt', 'DESC']],
  });

  return response.send(
    dailyPublicKeys.map(dailyPublicKey => ({
      keyId: dailyPublicKey.keyId,
      publicKey: dailyPublicKey.publicKey,
      createdAt: moment(dailyPublicKey.createdAt).unix(),
      signature: dailyPublicKey.signature,
      issuerId: dailyPublicKey.issuerId,
    }))
  );
});

/**
 * Fetch only the current daily public key
 *
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-daily-keypair
 */
router.get('/current', async (request, response) => {
  const dailyPublicKey = await database.DailyPublicKey.findOne({
    order: [['createdAt', 'DESC']],
  });

  if (!dailyPublicKey) {
    return response.sendStatus(status.NOT_FOUND);
  }
  return response.send({
    keyId: dailyPublicKey.keyId,
    publicKey: dailyPublicKey.publicKey,
    createdAt: moment(dailyPublicKey.createdAt).unix(),
    signature: dailyPublicKey.signature,
    issuerId: dailyPublicKey.issuerId,
  });
});

// get own encrpyted daily private key
router.get(
  '/encrypted/:keyId',
  requireHealthDepartmentEmployee,
  validateParametersSchema(keyIdParametersSchema),
  async (request, response) => {
    const encryptedDailyPrivateKey = await database.EncryptedDailyPrivateKey.findOne(
      {
        where: {
          keyId: request.params.keyId,
          healthDepartmentId: request.user.departmentId,
        },
      }
    );

    if (!encryptedDailyPrivateKey) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      keyId: encryptedDailyPrivateKey.keyId,
      issuerId: encryptedDailyPrivateKey.issuerId,
      data: encryptedDailyPrivateKey.data,
      iv: encryptedDailyPrivateKey.iv,
      mac: encryptedDailyPrivateKey.mac,
      publicKey: encryptedDailyPrivateKey.publicKey,
      signature: encryptedDailyPrivateKey.signature,
      createdAt: moment(encryptedDailyPrivateKey.createdAt).unix(),
    });
  }
);

// get keyed status of a daily key
router.get(
  '/encrypted/:keyId/keyed',
  requireHealthDepartmentEmployee,
  validateParametersSchema(keyIdParametersSchema),
  async (request, response) => {
    const encryptedDailyPrivateKeys = await database.EncryptedDailyPrivateKey.findAll(
      {
        where: {
          keyId: request.params.keyId,
        },
      }
    );

    return response.send(
      encryptedDailyPrivateKeys.map(encryptedDailyPrivateKey => ({
        healthDepartmentId: encryptedDailyPrivateKey.healthDepartmentId,
        createdAt: moment(encryptedDailyPrivateKey.createdAt).unix(),
      }))
    );
  }
);

/**
 * Fetch a specific daily public key
 * @param keyId of the daily key to fetch
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-daily-keypair
 */
router.get(
  '/:keyId',
  validateParametersSchema(keyIdParametersSchema),
  async (request, response) => {
    const dailyPublicKey = await database.DailyPublicKey.findByPk(
      request.params.keyId
    );

    if (!dailyPublicKey) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      keyId: dailyPublicKey.keyId,
      publicKey: dailyPublicKey.publicKey,
      createdAt: moment(dailyPublicKey.createdAt).unix(),
      signature: dailyPublicKey.signature,
      issuerId: dailyPublicKey.issuerId,
    });
  }
);

/**
 * Rotate the daily key by having a health department generate a new key pair
 * and encrypting it for each health department using their respective HDEKP,
 * so they may retrieve it securely
 * @see https://www.luca-app.de/securityoverview/processes/daily_key_rotation.html
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDEKP
 */
router.post(
  '/rotate',
  requireHealthDepartmentEmployee,
  limitRequestsByUserPerHour('keys_daily_rotate_post_ratelimit_hour'),
  validateSchema(rotateSchema, '600kb'),
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async (request, response) => {
    const healthDepartment = request.user.HealthDepartment;
    const auditLogMeta = {
      keyId: request.body.keyId,
    };

    if (!healthDepartment.signedPublicHDSKP) {
      return response.sendStatus(status.FORBIDDEN);
    }

    // verify signature of daily key
    const signedDailyKeyData =
      int32ToHex(request.body.keyId) +
      int32ToHex(request.body.createdAt) +
      base64ToHex(request.body.publicKey);
    const isValidDailyKeySignature = VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(healthDepartment.publicHDSKP),
      signedDailyKeyData,
      base64ToHex(request.body.signature)
    );

    if (!isValidDailyKeySignature) {
      logEvent(request.user, {
        type: AuditLogEvents.ISSUE_DAILY_KEYPAIR,
        status: AuditStatusType.ERROR_INVALID_SIGNATURE,
        meta: auditLogMeta,
      });

      return response.sendStatus(status.FORBIDDEN);
    }

    // verify signatures of encryptedKeys
    for (const encryptedDailyPrivateKey of request.body
      .encryptedDailyPrivateKeys) {
      const signedData =
        int32ToHex(request.body.keyId) +
        int32ToHex(request.body.createdAt) +
        base64ToHex(encryptedDailyPrivateKey.publicKey);
      const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
        base64ToHex(healthDepartment.publicHDSKP),
        signedData,
        base64ToHex(encryptedDailyPrivateKey.signature)
      );

      if (!isValidSignature) {
        logEvent(request.user, {
          type: AuditLogEvents.ISSUE_DAILY_KEYPAIR,
          status: AuditStatusType.ERROR_INVALID_SIGNATURE,
          meta: auditLogMeta,
        });

        return response.sendStatus(status.FORBIDDEN);
      }
    }

    // check createdAt
    const now = moment();
    const createdAt = moment.unix(request.body.createdAt);
    if (moment.duration(now.diff(createdAt)).as('minutes') > 5) {
      logEvent(request.user, {
        type: AuditLogEvents.ISSUE_DAILY_KEYPAIR,
        status: AuditStatusType.ERROR_TIMEFRAME,
        meta: auditLogMeta,
      });

      return response.sendStatus(status.CONFLICT);
    }

    const transaction = await database.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const dailyPublicKey = await database.DailyPublicKey.findOne(
        {
          order: [['createdAt', 'DESC']],
        },
        { transaction }
      );

      // initial keyId should be 0
      if (!dailyPublicKey && request.body.keyId !== 0) {
        logEvent(request.user, {
          type: AuditLogEvents.ISSUE_DAILY_KEYPAIR,
          status: AuditStatusType.ERROR_INVALID_KEYID,
          meta: auditLogMeta,
        });

        await transaction.rollback();
        return response.sendStatus(status.CONFLICT);
      }

      // new keyId should +1 the old keyId
      if (
        dailyPublicKey &&
        (dailyPublicKey.keyId + 1) % config.get('keys.daily.max') !==
          request.body.keyId
      ) {
        await transaction.rollback();

        logEvent(request.user, {
          type: AuditLogEvents.ISSUE_DAILY_KEYPAIR,
          status: AuditStatusType.ERROR_LIMIT_EXCEEDED,
          meta: auditLogMeta,
        });

        return response.sendStatus(status.CONFLICT);
      }

      if (dailyPublicKey) {
        const keyAge = moment.duration(moment().diff(dailyPublicKey.createdAt));

        // old key should be at least 1 day old before rotation
        if (keyAge.asHours() < config.get('keys.daily.minKeyAge')) {
          logEvent(request.user, {
            type: AuditLogEvents.ISSUE_DAILY_KEYPAIR,
            status: AuditStatusType.ERROR_LIMIT_EXCEEDED,
            meta: auditLogMeta,
          });
          await transaction.rollback();
          return response.sendStatus(status.CONFLICT);
        }
      }

      await database.DailyPublicKey.upsert(
        {
          keyId: request.body.keyId,
          publicKey: request.body.publicKey,
          signature: request.body.signature,
          createdAt: moment.unix(request.body.createdAt),
          issuerId: request.user.departmentId,
        },
        { transaction }
      );

      const encryptedDailyPrivateKeys = request.body.encryptedDailyPrivateKeys.map(
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
        encryptedDailyPrivateKeys.map(key =>
          database.EncryptedDailyPrivateKey.upsert(key, { transaction })
        )
      );

      await transaction.commit();

      logEvent(request.user, {
        type: AuditLogEvents.ISSUE_DAILY_KEYPAIR,
        status: AuditStatusType.SUCCESS,
        meta: auditLogMeta,
      });

      return response.sendStatus(status.OK);
    } catch (error) {
      await transaction.rollback();
      request.log.error(error);

      logEvent(request.user, {
        type: AuditLogEvents.ISSUE_DAILY_KEYPAIR,
        status: AuditStatusType.ERROR_UNKNOWN_SERVER_ERROR,
        meta: auditLogMeta,
      });

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

/**
 * Provide missing daily keys to other health departments by having a health
 * department generate a new one and encrypting it for each other department and
 * finally uploading it to the luca Server to be retrieved by the other departments
 *
 * @see https://www.luca-app.de/securityoverview/processes/daily_key_rotation.html
 */
router.post(
  '/rekey',
  requireHealthDepartmentEmployee,
  validateSchema(rekeySchema, '600kb'),
  async (request, response) => {
    const healthDepartment = request.user.HealthDepartment;
    const { encryptedDailyPrivateKeys, keyId, createdAt } = request.body;

    const auditLogMeta = { keyId };

    if (!healthDepartment.signedPublicHDSKP) {
      return response.sendStatus(status.FORBIDDEN);
    }

    // verify signatures of encryptedKeys
    for (const encryptedDailyPrivateKey of encryptedDailyPrivateKeys) {
      const signedData =
        int32ToHex(keyId) +
        int32ToHex(createdAt) +
        base64ToHex(encryptedDailyPrivateKey.publicKey);
      const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
        base64ToHex(healthDepartment.publicHDSKP),
        signedData,
        base64ToHex(encryptedDailyPrivateKey.signature)
      );

      if (!isValidSignature) {
        logEvent(request.user, {
          type: AuditLogEvents.REKEY_DAILY_KEYPAIR,
          status: AuditStatusType.ERROR_INVALID_SIGNATURE,
          meta: auditLogMeta,
        });

        return response.sendStatus(status.FORBIDDEN);
      }
    }

    const dailyPublicKey = await database.DailyPublicKey.findOne({
      where: { keyId, createdAt: moment.unix(createdAt) },
    });

    if (!dailyPublicKey) {
      logEvent(request.user, {
        type: AuditLogEvents.REKEY_DAILY_KEYPAIR,
        status: AuditStatusType.ERROR_TARGET_NOT_FOUND,
        meta: auditLogMeta,
      });

      return response.sendStatus(status.CONFLICT);
    }

    for (const encryptedDailyPrivateKey of encryptedDailyPrivateKeys) {
      const newKey = {
        keyId,
        createdAt: moment.unix(createdAt),
        issuerId: request.user.departmentId,
        healthDepartmentId: encryptedDailyPrivateKey.healthDepartmentId,
        data: encryptedDailyPrivateKey.data,
        iv: encryptedDailyPrivateKey.iv,
        mac: encryptedDailyPrivateKey.mac,
        publicKey: encryptedDailyPrivateKey.publicKey,
        signature: encryptedDailyPrivateKey.signature,
      };
      const oldKey = await database.EncryptedDailyPrivateKey.findOne({
        where: {
          keyId,
          healthDepartmentId: encryptedDailyPrivateKey.healthDepartmentId,
        },
      });

      if (!oldKey) {
        await database.EncryptedDailyPrivateKey.create(newKey);
      } else if (oldKey.createdAt === dailyPublicKey.createdAt) {
        logEvent(request.user, {
          type: AuditLogEvents.REKEY_DAILY_KEYPAIR,
          status: AuditStatusType.ERROR_CONFLICT_KEY,
          meta: auditLogMeta,
        });

        request.log.warn('key already current.');
      } else {
        logEvent(request.user, {
          type: AuditLogEvents.REKEY_DAILY_KEYPAIR,
          status: AuditStatusType.SUCCESS,
          meta: {
            oldKeyHd: oldKey.healthDepartmentId,
            newKeyId: keyId,
            oldKeyId: oldKey.keyId,
          },
        });

        oldKey.update(newKey);
      }
    }

    return response.sendStatus(status.OK);
  }
);

module.exports = router;
