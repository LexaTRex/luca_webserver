const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const config = require('config');

const database = require('../../database');
const { validateSchema } = require('../../middlewares/validateSchema');
const { limitRequestsPerMinute } = require('../../middlewares/rateLimit');

const { redeemSchema, redeemDeleteSchema } = require('./tests.schemas');

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
  limitRequestsPerMinute('tests_redeem_post_ratelimit_minute'),
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

router.delete(
  '/redeem',
  limitRequestsPerMinute('tests_redeem_delete_ratelimit_minute'),
  validateSchema(redeemDeleteSchema),
  async (request, response) => {
    const {
      body: { hash, tag },
    } = request;
    const testRedeem = await database.TestRedeem.findOne({
      where: { hash, tag },
    });

    if (!testRedeem) {
      return response.sendStatus(status.NOT_FOUND);
    }

    await testRedeem.destroy();
    return response.sendStatus(status.NO_CONTENT);
  }
);

module.exports = router;
