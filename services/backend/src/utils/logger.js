const { createLogger, transports, format } = require('winston');
const config = require('config');

const stripSequelizeParametersFromErrors = format(info => {
  // eslint-disable-next-line no-param-reassign
  delete info?.meta?.error?.parameters;
  // eslint-disable-next-line no-param-reassign
  delete info?.meta?.error?.parent?.parameters;
  // eslint-disable-next-line no-param-reassign
  delete info?.meta?.error?.original?.parameters;
  return info;
});

const logger = createLogger({
  transports: [
    new transports.Console({
      level: config.get('loglevel'),
      format: format.combine(
        stripSequelizeParametersFromErrors(),
        format.json()
      ),
    }),
  ],
});

module.exports = logger;
