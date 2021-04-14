const router = require('express').Router();
const status = require('http-status');
const config = require('config');
const moment = require('moment');
const { Op } = require('sequelize');
const database = require('../../../database');
const mailjet = require('../../../utils/mailjet');
const {
  validateParametersSchema,
  validateSchema,
} = require('../../../middlewares/validateSchema');
const { limitRequestsPerHour } = require('../../../middlewares/rateLimit');
const { requireOperator } = require('../../../middlewares/requireUser');

const {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetRequestSchema,
} = require('./password.schemas');

// change password
router.post(
  '/change',
  limitRequestsPerHour(15, { skipSuccessfulRequests: true }),
  requireOperator,
  validateSchema(changePasswordSchema),
  async (request, response) => {
    const operator = request.user;

    const isCurrentPasswordCorrect = await operator.checkPassword(
      request.body.currentPassword
    );

    if (!isCurrentPasswordCorrect) {
      return response.sendStatus(status.FORBIDDEN);
    }

    await operator.update({
      password: request.body.newPassword,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// password forgot
router.post(
  '/forgot',
  limitRequestsPerHour(5),
  validateSchema(forgotPasswordSchema),
  async (request, response) => {
    const operator = await database.Operator.findOne({
      where: {
        email: request.body.email.toLowerCase(),
        activated: true,
      },
    });

    // Operator with the mail does not exist
    if (!operator) {
      return response.sendStatus(status.NOT_FOUND);
    }

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

    mailjet.sendForgotPasswordMail(
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
  limitRequestsPerHour(15, { skipSuccessfulRequests: true }),
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
  limitRequestsPerHour(15, { skipSuccessfulRequests: true }),
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

    return response.send(resetRequest);
  }
);

module.exports = router;
