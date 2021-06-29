const router = require('express').Router();
const database = require('../../database');

router.get('/', async (_, response) => {
  const testProviders = await database.TestProvider.findAll();

  return response.send(
    testProviders.map(({ name, publicKey, fingerprint }) => ({
      name,
      publicKey,
      fingerprint,
    }))
  );
});

module.exports = router;
