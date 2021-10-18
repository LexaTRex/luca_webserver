import pino from 'pino';
import pinoHttp from 'pino-http';
import pick from 'lodash/pick';
import config from 'config';
import { v4 as uuid } from 'uuid';
import type { ServerResponse, IncomingMessage } from 'http';

/* eslint-disable no-param-reassign */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const errorSerializer = (error: any) => {
  if (error?.parameters) error.parameters = undefined;
  if (error?.parent?.parameters) error.parent.parameters = undefined;
  if (error?.original?.parameters) error.original.parameters = undefined;
  return error;
};

const requestSerializer = (request: IncomingMessage) => {
  if (config.get('debug')) return request;
  request.headers = pick(request.headers, [
    'connection',
    'host',
    'origin',
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
    'ssl-client-subject-dn',
  ]);
  return request;
};

const responseSerializer = (response: ServerResponse) => {
  if (config.get('debug')) return response;
  response.headers = pick(response.headers, ['content-type', 'content-length']);
  return response;
};
/* eslint-enable no-param-reassign */

const customMessage = (response: ServerResponse) => {
  const {
    req: { method, originalUrl },
    statusCode,
  } = response;
  return `${statusCode} ${method} ${originalUrl}`;
};

const logger = pino({ level: config.get('loglevel') });

export const httpLogger = pinoHttp({
  logger,
  autoLogging: { ignorePaths: ['/api/v3/health', '/api/v3/health/ready'] },
  serializers: {
    req: requestSerializer,
    res: responseSerializer,
    err: errorSerializer,
  },
  customLogLevel: (response: ServerResponse, error: Error) => {
    if (response.statusCode >= 400 && response.statusCode < 500) return 'warn';
    if (response.statusCode >= 500 || error) return 'error';
    return 'info';
  },
  customSuccessMessage: customMessage,
  customErrorMessage: (error: Error, response: ServerResponse) =>
    customMessage(response),
  genReqId: () => uuid(),
});

export default logger;
