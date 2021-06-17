const config = require('config');
const status = require('http-status');

const ApiError = require('../utils/apiError');
const { SessionError } = require('../passport/session');

const handle404 = (request, response) => response.sendStatus(status.NOT_FOUND);

const handle500 = (error, request, response, next) => {
  if (error instanceof SessionError) {
    request.logout();
    request.session.destroy();
    return response
      .status(status.UNAUTHORIZED)
      .send({ message: error.message });
  }
  if (error instanceof ApiError) {
    const errorDTO = {
      code: error.errorCode,
      message: error.message,
    };
    if (config.get('debug')) {
      errorDTO.stack = error.stack;
    }
    return response.status(error.statusCode).send(errorDTO);
  }

  if (config.get('debug')) {
    return next(error);
  }
  if (error.statusCode) {
    return response.sendStatus(error.statusCode);
  }
  return response.sendStatus(status.INTERNAL_SERVER_ERROR);
};

module.exports = {
  handle404,
  handle500,
};
