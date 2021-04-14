const z = require('zod');
const status = require('http-status');
const parsePhoneNumber = require('libphonenumber-js/mobile');
const logger = require('../utils/logger');
const passwordCheck = require('../utils/passwordCheck');

const validateSchema = schema => async (request, response, next) => {
  try {
    request.body = schema.parse(request.body);
    return next();
  } catch (error) {
    logger.warn('validateSchema', error);
    response.status(status.BAD_REQUEST);
    return response.send(error);
  }
};

const validateQuerySchema = schema => async (request, response, next) => {
  try {
    request.query = schema.parse(request.query);
    return next();
  } catch (error) {
    logger.warn('validateSchema', error);
    response.status(status.BAD_REQUEST);
    return response.send(error);
  }
};

const validateParametersSchema = schema => async (request, response, next) => {
  try {
    request.params = schema.parse(request.params);
    return next();
  } catch (error) {
    logger.warn('validateSchema', error);
    response.status(status.BAD_REQUEST);
    return response.send(error);
  }
};

const supportedLanguagesEnum = z.union([z.literal('de'), z.literal('en')]);

z.telephoneNumber = () =>
  z.string(32).refine(
    value => {
      const number = parsePhoneNumber(value, 'DE');
      return !!number && number.isValid();
    },
    {
      message: 'invalid phonenumber',
    }
  );

module.exports = {
  z,
  validateSchema,
  validateQuerySchema,
  validateParametersSchema,
  supportedLanguagesEnum,
  passwordMeetsCriteria: passwordCheck,
};
