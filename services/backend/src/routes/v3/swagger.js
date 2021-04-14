const router = require('express').Router();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { promisify } = require('util');
const glob = promisify(require('glob'));
const YAML = require('js-yaml');
const fs = require('fs');
const mergeWith = require('lodash/mergeWith');
const isArray = require('lodash/isArray');
const logger = require('../../utils/logger');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'luca API',
    version: '3.0.0',
    description: '',
  },
  servers: [
    { url: '/api/v3', description: 'This server' },
    { url: 'https://app.luca-app.de/api/v3', description: 'Production' },
  ],
};

const swaggerJsOptions = {
  swaggerDefinition,
  apis: ['./src/routes/**/*.js'],
};

// eslint-disable-next-line unicorn/prevent-abbreviations
const specFromJSDoc = swaggerJSDoc(swaggerJsOptions);

// eslint-disable-next-line consistent-return
const mergeArraysByConcat = (objectValue, sourceValue) => {
  if (isArray(objectValue)) {
    return [...objectValue, ...sourceValue];
  }
};

const swaggerSpec = {};
// this modifies swaggerSpec directly
const mergeSpecFragment = fragment => {
  mergeWith(swaggerSpec, fragment, mergeArraysByConcat);
};

glob('./src/routes/v3/**/*.openapi.yaml', {})
  .then(paths => {
    paths.forEach(path => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const fileContents = fs.readFileSync(path, 'utf8');
      const singleSpec = YAML.load(fileContents);
      delete singleSpec.tags; // use JSDoc definition for tags
      mergeSpecFragment(singleSpec);
    });

    mergeSpecFragment(specFromJSDoc);

    router.get('/swagger.json', (_request, response) =>
      response.json(swaggerSpec)
    );
    router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  })
  .catch(logger.error);

module.exports = router;
