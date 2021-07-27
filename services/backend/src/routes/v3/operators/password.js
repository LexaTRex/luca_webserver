/**
 * @overview Provides endpoints allowing venue operators to update their
 * respective passwords, required for operating the venue owner frontend
 *
 * @see https://www.luca-app.de/securityoverview/processes/venue_registration.html?highlight=password#process
 */

const router = require('express').Router();
const status = require('http-status');
const config = require('config');
const moment = require('moment');
const { Op } = require('sequelize');
const database = require('../../../database');
const mailClient = require('../../../utils/mailClient');
const {
  validateParametersSchema,
  validateSchema,
} = require('../../../middlewares/validateSchema');

const { limitRequestsPerHour } = require('../../../middlewares/rateLimit');
const {
  requireOperator,
  requireNonDeletedUser,
} = require('../../../middlewares/requireUser');

const {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetRequestSchema,
} = require('./password.schemas');

// change password
router.post(
  '/change',
  limitRequestsPerHour('password_change_post_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  requireOperator,
  requireNonDeletedUser,
  validateSchema(changePasswordSchema),
  async (request, response) => {
    const operator = request.user;
    const { currentPassword, newPassword, lang } = request.body;

    const isCurrentPasswordCorrect = await operator.checkPassword(
      currentPassword
    );

    if (!isCurrentPasswordCorrect) {
      return response.sendStatus(status.FORBIDDEN);
    }

    await operator.update({
      password: newPassword,
    });

    mailClient.operatorUpdatePasswordNotification(
      operator.email,
      `${operator.fullName}`,
      lang,
      {
        email: operator.email,
      }
    );

    return response.sendStatus(status.NO_CONTENT);
  }
);

// password forgot
router.post(
  '/forgot',
  limitRequestsPerHour('password_forgot_post_ratelimit_hour'),
  validateSchema(forgotPasswordSchema),
  async (request, response) => {
    const operator = await database.Operator.findOne({
      where: {
        email: request.body.email,
      },
    });

    if (!operator) return response.sendStatus(status.NOT_FOUND);

    if (!operator.activated) return response.sendStatus(status.LOCKED);

    await database.PasswordReset.update(
      { closed: true },
      {
        where: {
          operatorId: operator.uuid,
          createdAt: { [Op.gt]: moment().subtract(1, 'day') },
        },
      }
    );

    const forgotPasswordRequest = await database.PasswordReset.create({
      operatorId: operator.uuid,
      email: operator.email,
    });

    mailClient.sendForgotPasswordMail(
      forgotPasswordRequest.email,
      operator.fullName,
      request.body.lang,
      {
        firstName: operator.firstName,
        forgotPasswordLink: `https://${config.get('hostname')}/resetPassword/${
          forgotPasswordRequest.uuid
        }`,
      }
    );

    return response.sendStatus(status.NO_CONTENT);
  }
);

// reset password
router.post(
  '/reset',
  limitRequestsPerHour('password_reset_post_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  validateSchema(resetPasswordSchema),
  async (request, response) => {
    const resetRequest = await database.PasswordReset.findOne({
      where: {
        uuid: request.body.resetId,
        closed: false,
        createdAt: {
          [Op.gt]: moment().subtract(config.get('emails.expiry'), 'hours'),
        },
      },
    });

    const operator = await database.Operator.findByPk(resetRequest.operatorId);

    if (!operator || !resetRequest) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await database.transaction(async transaction => {
      return Promise.all([
        operator.update(
          {
            password: request.body.newPassword,
          },
          { transaction }
        ),
        database.PasswordReset.update(
          { closed: true },
          {
            where: {
              operatorId: operator.uuid,
              createdAt: { [Op.gt]: moment().subtract(1, 'day') },
            },
            transaction,
          }
        ),
      ]);
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// get password reset
router.get(
  '/reset/:resetId',
  limitRequestsPerHour('password_reset_get_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  validateParametersSchema(resetRequestSchema),
  async (request, response) => {
    const { resetId } = request.params;

    const resetRequest = await database.PasswordReset.findOne({
      where: {
        uuid: resetId,
        closed: false,
        createdAt: {
          [Op.gt]: moment().subtract(config.get('emails.expiry'), 'hours'),
        },
      },
    });

    if (!resetRequest) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      uuid: resetRequest.uuid,
      operatorId: resetRequest.operatorId,
      email: resetRequest.email,
      closed: resetRequest.closed,
    });
  }
);

module.exports = router;
