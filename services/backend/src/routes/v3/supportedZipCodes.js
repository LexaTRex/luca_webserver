const router = require('express').Router();
const status = require('http-status');
const cors = require('cors');
const config = require('config');

const database = require('../../database');
const {
  validateParametersSchema,
} = require('../../middlewares/validateSchema');

const { zipParametersSchema } = require('./supportedZipCodes.schemas');

const HOST_NAME = config.get('hostname') || 'app.luca-app.de';
const corsOptions = {
  origin: [
    'https://www.luca-app.de',
    'https://luca-app.de',
    `https://${HOST_NAME}`,
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) have a problem with 204
};

router.use(cors(corsOptions));

// get all supported zip codes
router.get('/', async (request, response) => {
  const supportedZipCodes = await database.SupportedZipCode.findAll();
  return response.send(
    supportedZipCodes.map(supportedZipCode => supportedZipCode.zip)
  );
});

// check single zip code
router.get(
  '/:zipCode',
  validateParametersSchema(zipParametersSchema),
  async (request, response) => {
    const zip = await database.SupportedZipCode.findByPk(
      request.params.zipCode
    );

    if (!zip) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.sendStatus(status.OK);
  }
);

module.exports = router;
