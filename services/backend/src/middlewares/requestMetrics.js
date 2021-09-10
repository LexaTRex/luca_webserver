const responseTime = require('response-time');

const { client } = require('../utils/metrics');

const labelNames = ['method', 'statusCode', 'path', 'host'];

const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'A histogram of the HTTP request durations in seconds.',
  buckets: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
  labelNames,
});

const responseSize = new client.Histogram({
  name: 'http_response_size_bytes',
  help: 'A histogram of the HTTP response size in bytes.',
  buckets: [100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000],
  labelNames,
});

module.exports = responseTime((request, response, time) => {
  const {
    method,
    route,
    baseUrl,
    headers: { host },
  } = request;
  const { statusCode, _contentLength } = response;

  if (!route) return;
  const path = `${baseUrl}${route.path}`.toLowerCase();

  const labels = {
    method,
    path,
    statusCode,
    host,
  };

  requestDuration.observe(labels, time / 1000);
  responseSize.observe(labels, _contentLength || 0);
});
