const router = require('express').Router();
const status = require('http-status');

const database = require('../../database');
const { validateSchema } = require('../../middlewares/validateSchema');
const { limitRequestsPerMinute } = require('../../middlewares/rateLimit');

const { redeemSchema } = require('./tests.schemas');

// Redeem a test
router.post(
  '/redeem',
  limitRequestsPerMinute(10),
  validateSchema(redeemSchema),
  async (request, response) => {
    const testRedeem = await database.TestRedeem.findByPk(request.body.hash);

    if (!testRedeem) {
      await database.TestRedeem.create({
        hash: request.body.hash,
        tag: request.body.tag,
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
