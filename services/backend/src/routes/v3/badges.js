const router = require('express').Router();
const status = require('http-status');
const config = require('config');
const passport = require('passport');

const {
  uuidToHex,
  base64ToHex,
  hexToBase64,
  SIGN_EC_SHA256_IEEE,
  VERIFY_EC_SHA256_DER_SIGNATURE,
} = require('@lucaapp/crypto');

const { validateSchema } = require('../../middlewares/validateSchema');
const { limitRequestsPerHour } = require('../../middlewares/rateLimit');

const {
  getBloomFilter,
  getBloomFilterEtag,
} = require('../../utils/bloomFilter');

const database = require('../../database');
const { badgeCreateSchema } = require('./badges.schemas');

/**
 * Creates an empty user for a new generated static badge. Returns an error if
 * the given user id already exists or the signature is not valid for the
 * given public key. On success, returns an attestation signature computed with
 * the badge private key.
 *
 * @see https://www.luca-app.de/securityoverview/badge/badge_generation.html#process
 */

router.post(
  '/',
  limitRequestsPerHour(10, { skipSuccessfulRequests: true }),
  passport.authenticate('bearer-badgeGenerator', { session: false }),
  validateSchema(badgeCreateSchema),
  async (request, response) => {
    const isValidSignature = VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(request.body.publicKey),
      uuidToHex(request.body.userId) + base64ToHex(request.body.data),
      base64ToHex(request.body.signature)
    );

    if (!isValidSignature) {
      return response.sendStatus(status.FORBIDDEN);
    }

    const existingUser = await database.User.findOne({
      where: {
        uuid: request.body.userId,
      },
    });

    if (existingUser) {
      return response.sendStatus(status.CONFLICT);
    }

    await database.User.create({
      uuid: request.body.userId,
      data: '',
      publicKey: request.body.publicKey,
      deviceType: 'static',
    });

    const signature = SIGN_EC_SHA256_IEEE(
      base64ToHex(config.get('keys.badge.private')),
      uuidToHex(request.body.userId) + base64ToHex(request.body.data)
    );

    return response.send({
      signature: hexToBase64(signature),
    });
  }
);

router.get('/bloomFilter', async (request, response) => {
  const bloomFilterEtag = await getBloomFilterEtag();
  if (bloomFilterEtag === request.headers['If-None-Match']) {
    return response.sendStatus(status.NOT_MODIFIED);
  }

  const bloomFilter = await getBloomFilter();
  if (!bloomFilter) {
    return response.sendStatus(status.NOT_FOUND);
  }

  response.setHeader('ETag', bloomFilterEtag);
  return response.send(bloomFilter);
});

module.exports = router;
