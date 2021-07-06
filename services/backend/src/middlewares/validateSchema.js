const z = require('zod');
const express = require('express');
const status = require('http-status');
const parsePhoneNumber = require('libphonenumber-js/max');
const logger = require('../utils/logger');
const passwordCheck = require('../utils/passwordCheck');

const defaultJsonMiddleware = express.json();

const waitForMiddleware = (middleware, request, response) =>
  new Promise((resolve, reject) => {
    try {
      middleware(request, response, () => {
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });

const validateSchema = (schema, limit) => {
  const jsonMiddleware = limit
    ? express.json({ limit })
    : defaultJsonMiddleware;

  return async (request, response, next) => {
    await waitForMiddleware(jsonMiddleware, request, response);

    try {
      request.body = schema.parse(request.body);
      return next();
    } catch (error) {
      logger.warn('validateSchema', error);
      response.status(status.BAD_REQUEST);
      return response.send(error);
    }
  };
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
