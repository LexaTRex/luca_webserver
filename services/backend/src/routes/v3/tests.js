const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const config = require('config');

const database = require('../../database');
const { validateSchema } = require('../../middlewares/validateSchema');
const { limitRequestsPerMinute } = require('../../middlewares/rateLimit');

const { redeemSchema } = require('./tests.schemas');

const REDEEM_MAX_EXPIRY = moment.duration(
  config.get('luca.testRedeems.maxAge'),
  'hours'
);
const REDEEM_DEFAULT_EXPIRY = moment.duration(
  config.get('luca.testRedeems.defaultMaxAge'),
  'hours'
);

// Redeem a test
router.post(
  '/redeem',
  limitRequestsPerMinute(50),
  validateSchema(redeemSchema),
  async (request, response) => {
    const testRedeem = await database.TestRedeem.findByPk(request.body.hash);

    if (!testRedeem) {
      await database.TestRedeem.create({
        hash: request.body.hash,
        tag: request.body.tag,
        expireAt: request.body.expireAt
          ? Math.min(
              moment.unix(request.body.expireAt),
              moment().add(REDEEM_MAX_EXPIRY)
            )
          : moment().add(REDEEM_DEFAULT_EXPIRY),
      });
      return response.sendStatus(status.NO_CONTENT);
    }

    if (testRedeem.tag === request.body.tag) {
      return response.sendStatus(status.NO_CONTENT);
    }

    return response.sendStatus(status.CONFLICT);
  }
);

module.exports = router;
