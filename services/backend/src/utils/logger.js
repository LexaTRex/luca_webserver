const { createLogger, transports, format } = require('winston');
const config = require('config');
const pick = require('lodash/pick');
const { MESSAGE } = require('triple-beam');
const colors = require('colors/safe');

/* eslint-disable no-param-reassign */
const stripSequelizeParametersFromErrors = format(info => {
  if (info?.meta?.error?.parameters) {
    delete info.meta.error.parameters;
  }
  if (info?.meta?.error?.parent?.parameters) {
    delete info.meta.error.parent.parameters;
  }
  if (info?.meta?.error?.original?.parameters) {
    delete info.meta.error.original.parameters;
  }
  return info;
});
/* eslint-enable no-param-reassign */

const filterHeaders = format(info => {
  if (info?.meta?.req?.headers) {
    // eslint-disable-next-line no-param-reassign
    info.meta.req.headers = pick(info.meta.req.headers, [
      'connection',
      'host',
      'x-real-ip',
      'x-forwarded-for',
      'x-forwarded-proto',
      'x-forwarded-host',
      'x-forwarded-port',
      'x-scheme',
      'user-agent',
      'content-type',
      'accept',
      'referer',
      'accept-encoding',
    ]);
  }
  return info;
});

colors.setTheme({
  okStatus: ['green', 'bold'],
  warnStatus: ['yellow', 'bold'],
  errorStatus: ['red', 'bold'],
});

const customFormat = format(info => {
  const stringifiedRest = JSON.stringify({
    ...info,
    level: undefined,
    message: undefined,
    splat: undefined,
  });

  const padding = ' '.repeat(Math.max(15 - info.level.length, 0));

  let statusCodeMessage = '';
  const statusCode = info.meta?.res?.statusCode;
  if (statusCode >= 200 && statusCode < 400) {
    statusCodeMessage = `${colors.okStatus(statusCode.toString())} `;
  } else if (statusCode >= 400 && statusCode < 500) {
    statusCodeMessage = `${colors.warnStatus(statusCode.toString())} `;
  } else if (statusCode >= 500) {
    statusCodeMessage = `${colors.errorStatus(statusCode.toString())} `;
  }
  if (stringifiedRest !== '{}') {
    // eslint-disable-next-line no-param-reassign,security/detect-object-injection
    info[
      MESSAGE
    ] = `${info.level}${padding} ${statusCodeMessage}${info.message} ${stringifiedRest}`;
  } else {
    // eslint-disable-next-line no-param-reassign
    info[MESSAGE] = `${info.level}${padding} ${info.message}`;
  }

  return info;
});

const formats =
  process.env.NODE_ENV === 'development'
    ? [
        stripSequelizeParametersFromErrors(),
        filterHeaders(),
        format.colorize(),
        customFormat(),
      ]
    : [stripSequelizeParametersFromErrors(), filterHeaders(), format.json()];

const logger = createLogger({
  transports: [
    new transports.Console({
      level: config.get('loglevel'),
      format: format.combine(...formats),
    }),
  ],
});

module.exports = logger;
