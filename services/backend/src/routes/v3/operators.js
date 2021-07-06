/* eslint-disable max-lines */

const crypto = require('crypto');
const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const config = require('config');

const database = require('../../database');
const mailClient = require('../../utils/mailClient');
const { generateSupportCode } = require('../../utils/generators');
const { validateSchema } = require('../../middlewares/validateSchema');
const {
  requireOperator,
  requireNonDeletedUser,
} = require('../../middlewares/requireUser');
const { limitRequestsPerDay } = require('../../middlewares/rateLimit');
const {
  requireNonBlockedIp,
} = require('../../middlewares/requireNonBlockedIp');
const locationsRouter = require('./operators/locations');
const passwordRouter = require('./operators/password');
const emailsRouter = require('./operators/email');

const {
  createSchema,
  activationSchema,
  storePublicKeySchema,
  updateOperatorSchema,
} = require('./operators.schemas');

// create operator
router.post(
  '/',
  limitRequestsPerDay(10),
  validateSchema(createSchema),
  requireNonBlockedIp,
  async (request, response) => {
    const existingOperator = await database.Operator.findOne({
      where: {
        username: request.body.email,
      },
      paranoid: false,
    });

    if (existingOperator) {
      return response.sendStatus(status.CONFLICT);
    }

    let operator;
    let activationMail;

    await database.transaction(async transaction => {
      operator = await database.Operator.create(
        {
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          email: request.body.email,
          username: request.body.email,
          password: request.body.password,
          salt: crypto.randomBytes(16).toString('base64'),
          privateKeySecret: crypto.randomBytes(32).toString('base64'),
          supportCode: generateSupportCode(),
          avvAccepted: request.body.avvAccepted,
          lastVersionSeen: request.body.lastVersionSeen,
        },
        { transaction }
      );

      activationMail = await database.EmailActivation.create(
        {
          operatorId: operator.uuid,
          email: operator.email,
          type: 'Registration',
        },
        { transaction }
      );
    });

    mailClient.sendActivationMail(
      activationMail.email,
      operator.fullName,
      request.body.lang,
      {
        firstName: request.body.firstName,
        activationLink: `https://${config.get('hostname')}/activation/${
          activationMail.uuid
        }`,
      }
    );

    return response.sendStatus(status.NO_CONTENT);
  }
);

// active operator account
router.post(
  '/activate',
  validateSchema(activationSchema),
  async (request, response) => {
    const { activationId, lang } = request.body;

    const activationMail = await database.EmailActivation.findOne({
      where: {
        uuid: activationId,
        type: 'Registration',
      },
    });

    if (!activationMail) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (activationMail.closed) {
      return response.sendStatus(status.CONFLICT);
    }

    if (
      activationMail.createdAt <
      moment().subtract(config.get('emails.expiry'), 'hours')
    ) {
      return response.sendStatus(status.GONE);
    }

    const operator = await database.Operator.findByPk(
      activationMail.operatorId
    );

    if (!operator) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await database.transaction(async transaction => {
      return Promise.all([
        activationMail.update(
          {
            closed: true,
          },
          { transaction }
        ),
        operator.update(
          {
            activated: true,
          },
          { transaction }
        ),
      ]);
    });

    mailClient.sendRegistrationConfirmation(
      activationMail.email,
      operator.fullName,
      lang,
      {
        firstName: operator.firstName,
      }
    );

    return response.sendStatus(status.CREATED);
  }
);

// set operator public key
router.post(
  '/publicKey',
  requireOperator,
  requireNonDeletedUser,
  validateSchema(storePublicKeySchema),
  async (request, response) => {
    if (request.user.publicKey) {
      return response.sendStatus(status.FORBIDDEN);
    }

    request.user.update({
      publicKey: request.body.publicKey,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// update operator
router.patch(
  '/',
  requireOperator,
  requireNonDeletedUser,
  validateSchema(updateOperatorSchema),
  async (request, response) => {
    const operator = request.user;
    await operator.update({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      avvAccepted: request.body.avvAccepted,
      lastVersionSeen: request.body.lastVersionSeen,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// get private key secret
router.get('/privateKeySecret', requireOperator, (request, response) => {
  return response.send({ privateKeySecret: request.user.privateKeySecret });
});

// request account deactivation
router.delete('/', requireOperator, async (request, response) => {
  const operator = request.user;

  const locations = await operator.getLocations();

  await database.transaction(async transaction => {
    for (const location of locations) {
      await database.Location.checkoutAllTraces({ location, transaction });
    }
    await operator.destroy({ transaction });
  });

  const deletionScheduledAfter = moment()
    .add(config.get('luca.operators.deleted.maxAgeHours'), 'hours')
    .unix();

  response.send({
    deletionScheduledAfter,
  });
});

// undo account deactivation
router.post('/restore', requireOperator, async (request, response) => {
  const operator = request.user;
  await operator.restore();
  response.sendStatus(status.NO_CONTENT);
});

router.use('/locations', locationsRouter);
router.use('/password', passwordRouter);
router.use('/email', emailsRouter);

module.exports = router;
