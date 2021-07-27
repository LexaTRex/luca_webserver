/**
 * @overview Provides endpoints to venue operators to update their email, which they are required to provide
 * @see https://www.luca-app.de/securityoverview/processes/venue_registration.html?highlight=email#process
 */

const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const config = require('config');
const { Op } = require('sequelize');

const database = require('../../../database');
const mailClient = require('../../../utils/mailClient');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');

const { limitRequestsPerHour } = require('../../../middlewares/rateLimit');
const {
  requireOperator,
  requireNonDeletedUser,
} = require('../../../middlewares/requireUser');

const {
  updateMailSchema,
  activationSchema,
  emailParametersSchema,
} = require('./email.schemas');

// update email
router.patch(
  '/',
  requireOperator,
  requireNonDeletedUser,
  validateSchema(updateMailSchema),
  async (request, response) => {
    const operator = request.user;

    const { email, lang } = request.body;

    const existingUser = await database.Operator.findOne({
      where: { username: email },
    });

    if (existingUser) {
      return response.sendStatus(status.CONFLICT);
    }

    const activationMail = await database.EmailActivation.create({
      operatorId: operator.uuid,
      email,
      type: 'EmailChange',
    });

    mailClient.updateEmail(email, `${operator.fullName}`, lang, {
      firstName: operator.firstName,
      activationLink: `https://${config.get('hostname')}/activateEmail/${
        activationMail.uuid
      }`,
    });

    mailClient.updateEmailNotification(
      operator.email,
      `${operator.fullName}`,
      lang,
      {
        originalEmail: operator.email,
        newEmail: email,
      }
    );

    return response.sendStatus(status.NO_CONTENT);
  }
);

// check if email change is in progress
router.get(
  '/isChangeActive',
  requireOperator,
  requireNonDeletedUser,
  async (request, response) => {
    const operator = request.user;

    const activationMail = await database.EmailActivation.findOne({
      where: {
        operatorId: operator.uuid,
        closed: false,
        createdAt: {
          [Op.gt]: moment().subtract(config.get('emails.expiry'), 'hours'),
        },
        type: 'EmailChange',
      },
    });

    if (!activationMail) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.sendStatus(status.OK);
  }
);

// check if email is in system
router.get(
  '/:email',
  limitRequestsPerHour('email_get_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  validateParametersSchema(emailParametersSchema),
  async (request, response) => {
    const user = await database.Operator.findOne({
      where: {
        email: request.params.email,
      },
      paranoid: false, // allow soft-deleted operators to still log in
    });

    if (!user) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.sendStatus(status.OK);
  }
);

// confirm email change
router.post(
  '/confirm',
  limitRequestsPerHour('email_confirm_post_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  validateSchema(activationSchema),
  async (request, response) => {
    const { activationId } = request.body;

    const activationMail = await database.EmailActivation.findOne({
      where: {
        uuid: activationId,
        type: 'EmailChange',
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

    if (operator.deletedAt) {
      return response.status(status.FORBIDDEN).send({
        message: 'The account has been marked for deletion',
        errorCode: 'ACCOUNT_DEACTIVATED',
      });
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
            email: activationMail.email,
            username: activationMail.email,
          },
          { transaction }
        ),
      ]);
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

module.exports = router;
