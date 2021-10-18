const express = require('express');
const status = require('http-status');
const { waitForMiddleware } = require('../utils/middlewares');

const defaultJsonMiddleware = express.json();

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
      request.log.warn(error, 'validateSchema');
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
    request.log.warn(error, 'validateSchema');
    response.status(status.BAD_REQUEST);
    return response.send(error);
  }
};

const validateParametersSchema = schema => async (request, response, next) => {
  try {
    request.params = schema.parse(request.params);
    return next();
  } catch (error) {
    request.log.warn(error, 'validateSchema');
    response.status(status.BAD_REQUEST);
    return response.send(error);
  }
};

module.exports = {
  validateSchema,
  validateQuerySchema,
  validateParametersSchema,
};
