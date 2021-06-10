const { createLogger, transports, format } = require('winston');
const config = require('config');
const pick = require('lodash/pick');

const stripSequelizeParametersFromErrors = format(info => {
  // eslint-disable-next-line no-param-reassign
  delete info?.meta?.error?.parameters;
  // eslint-disable-next-line no-param-reassign
  delete info?.meta?.error?.parent?.parameters;
  // eslint-disable-next-line no-param-reassign
  delete info?.meta?.error?.original?.parameters;
  return info;
});

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

const logger = createLogger({
  transports: [
    new transports.Console({
      level: config.get('loglevel'),
      format: format.combine(
        stripSequelizeParametersFromErrors(),
        filterHeaders(),
        format.json()
      ),
    }),
  ],
});

module.exports = logger;
