const router = require('express').Router();
const status = require('http-status');
const crypto = require('crypto');
const config = require('config');
const parsePhoneNumber = require('libphonenumber-js');

const database = require('../../database');
const featureFlag = require('../../utils/featureFlag');
const { sendSMSTan: sendMMSMSTan } = require('../../utils/messagemobile');
const { sendSMSTan: sendSinchTan } = require('../../utils/sinch');
const { sendSMSTan: sendGTXTan } = require('../../utils/gtx');
const {
  requireNonBlockedIp,
} = require('../../middlewares/requireNonBlockedIp');
const { validateSchema } = require('../../middlewares/validateSchema');
const {
  limitRequestsPerMinute,
  limitRequestsPerHour,
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
  const gtxRate = await featureFlag.get('sms_rate_gtx');

  for (let count = 0; count < mmRate; count += 1) {
    providerList.push('mm');
  }

  for (let count = 0; count < sinchRate; count += 1) {
    providerList.push('sinch');
  }

  for (let count = 0; count < gtxRate; count += 1) {
    providerList.push('gtx');
  }

  requestCount = (requestCount + 1) % providerList.length;
  return providerList[Number(requestCount)];
};

router.post(
  '/request',
  requireNonBlockedIp,
  limitRequestsPerHour('sms_request_post_ratelimit_hour'),
  limitRequestsPerMinute('sms_request_post_ratelimit_minute', {
    global: true,
  }),
  validateSchema(requestSchema),
  limitRequestsByFixedLinePhoneNumberPerDay(
    'sms_request_post_ratelimit_fixed_phone_number'
  ),
  limitRequestsByPhoneNumberPerDay('sms_request_post_ratelimit_phone_number'),
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
        case 'gtx':
          messageId = await sendGTXTan(phoneNumber.number, tan);
          break;
        default:
          break;
      }
    } catch (error) {
      request.log.error(error, `failed to send sms [${provider}]`);
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
  limitRequestsPerDay('sms_verify_post_ratelimit_day'),
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
      where: {
        uuid: request.body.challengeId,
        tan: request.body.tan,
      },
    });

    if (!challenge) {
      return response.sendStatus(status.FORBIDDEN);
    }

    if (challenge.verified) {
      return response.sendStatus(status.NO_CONTENT);
    }

    if (challenge.isExpired) {
      return response.sendStatus(status.GONE);
    }

    await challenge.update({
      verified: true,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

router.post(
  '/verify/bulk',
  limitRequestsPerDay('sms_verify_bulk_post_ratelimit_day'),
  validateSchema(bulkVerifySchema),
  async (request, response) => {
    if (config.get('skipSmsVerification')) {
      await database.SMSChallenge.update(
        { verified: true },
        {
          where: { uuid: request.body.challengeIds },
        }
      );
      const challenge = await database.SMSChallenge.findOne({
        where: {
          uuid: request.body.challengeIds,
        },
      });
      return response.send({ challengeId: challenge.uuid });
    }

    const challenge = await database.SMSChallenge.findOne({
      where: {
        uuid: request.body.challengeIds,
        tan: request.body.tan,
      },
    });

    if (!challenge) {
      return response.sendStatus(status.FORBIDDEN);
    }

    if (challenge.verified) {
      return response.send({ challengeId: challenge.uuid });
    }

    if (challenge.isExpired) {
      return response.sendStatus(status.GONE);
    }

    await challenge.update({
      verified: true,
    });

    return response.send({ challengeId: challenge.uuid });
  }
);

module.exports = router;
