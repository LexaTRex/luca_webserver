const router = require('express').Router();
const status = require('http-status');
const crypto = require('crypto');
const config = require('config');
const parsePhoneNumber = require('libphonenumber-js');

const database = require('../../database');
const logger = require('../../utils/logger');
const featureFlag = require('../../utils/featureFlag');
const { sendSMSTan: sendMMSMSTan } = require('../../utils/messagemobile');
const { sendSMSTan: sendSinchTan } = require('../../utils/sinch');
const {
  requireNonBlockedIp,
} = require('../../middlewares/requireNonBlockedIp');
const { validateSchema } = require('../../middlewares/validateSchema');
const {
  limitRequestsPerMinute,
  limitRequestsPerDay,
  limitRequestsByPhoneNumberPerDay,
  limitRequestsByFixedLinePhoneNumberPerDay,
} = require('../../middlewares/rateLimit');

const {
  requestSchema,
  verifySchema,
  bulkVerifySchema,
} = require('./sms.schemas');

let requestCount = 0;
const getProvider = async () => {
  const providerList = [];
  const mmRate = await featureFlag.get('sms_rate_mm');
  const sinchRate = await featureFlag.get('sms_rate_sinch');

  for (let count = 0; count < mmRate; count += 1) {
    providerList.push('mm');
  }

  for (let count = 0; count < sinchRate; count += 1) {
    providerList.push('sinch');
  }

  requestCount = (requestCount + 1) % providerList.length;
  return providerList[Number(requestCount)];
};

router.post(
  '/request',
  limitRequestsPerDay(10),
  limitRequestsPerMinute(7200, { global: true }),
  validateSchema(requestSchema),
  limitRequestsByFixedLinePhoneNumberPerDay(1),
  limitRequestsByPhoneNumberPerDay(5),
  requireNonBlockedIp,
  async (request, response) => {
    const tan = crypto.randomInt(1000000).toString().padStart(6, '0');
    const provider = config.get('skipSmsVerification')
      ? 'debug'
      : await getProvider();
    const phoneNumber = parsePhoneNumber(request.body.phone, 'DE');

    const challenge = await database.SMSChallenge.create({
      tan,
      provider,
    });

    let messageId;
    try {
      switch (provider) {
        case 'debug':
          messageId = 'debug';
          break;
        case 'mm':
          messageId = await sendMMSMSTan(phoneNumber.number, tan);
          break;
        case 'sinch':
          messageId = await sendSinchTan(phoneNumber.number, tan);
          break;
        default:
          break;
      }
    } catch (error) {
      logger.error(`failed to send sms [${provider}]`, error);
      return response.sendStatus(status.SERVICE_UNAVAILABLE);
    }

    await challenge.update({
      messageId,
    });

    return response.send({
      challengeId: challenge.uuid,
    });
  }
);

router.post(
  '/verify',
  limitRequestsPerDay(50),
  validateSchema(verifySchema),
  async (request, response) => {
    if (config.get('skipSmsVerification')) {
      await database.SMSChallenge.update(
        { verified: true },
        {
          where: { uuid: request.body.challengeId },
        }
      );
      return response.sendStatus(status.NO_CONTENT);
    }

    const challenge = await database.SMSChallenge.findOne({
      where: { uuid: request.body.challengeId, tan: request.body.tan },
    });

    if (!challenge) {
      return response.sendStatus(status.FORBIDDEN);
    }

    if (challenge.verified) {
      return response.sendStatus(status.NO_CONTENT);
    }

    await challenge.update({
      verified: true,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

router.post(
  '/verify/bulk',
  limitRequestsPerDay(50),
  validateSchema(bulkVerifySchema),
  async (request, response) => {
    if (config.get('skipSmsVerification')) {
      await database.SMSChallenge.update(
        { verified: true },
        {
          where: { uuid: request.body.challengeIds },
        }
      );
      return response.sendStatus({ challengeId: request.body.challengeIds[0] });
    }

    const challenge = await database.SMSChallenge.findOne({
      where: { uuid: request.body.challengeIds, tan: request.body.tan },
    });

    if (!challenge) {
      return response.sendStatus(status.FORBIDDEN);
    }

    if (challenge.verified) {
      return response.send({ challengeId: challenge.uuid });
    }

    await challenge.update({
      verified: true,
    });

    return response.send({ challengeId: challenge.uuid });
  }
);

module.exports = router;
