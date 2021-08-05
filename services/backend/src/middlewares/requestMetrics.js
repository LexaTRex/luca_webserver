const responseTime = require('response-time');

const { client } = require('../utils/metrics');

const labelNames = ['method', 'statusCode', 'path'];

const histogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'A histogram of the HTTP request durations in seconds.',
  buckets: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
  labelNames,
});

const summary = new client.Summary({
  name: 'summary_http_request_duration_seconds',
  help: 'A summary of the HTTP request durations in seconds.',
  percentiles: [0.5, 0.75, 0.95, 0.98, 0.99, 0.999],
  labelNames,
});

const counter = new client.Counter({
  name: 'http_requests_total',
  help: 'The total number of handled HTTP requests.',
  labelNames,
});

module.exports = responseTime((request, response, time) => {
  const { method, route, baseUrl } = request;
  const { statusCode } = response;

  if (!route) return;
  const path = `${baseUrl}${route.path}`.toLowerCase();

  histogram.observe(
    {
      method,
      path,
      statusCode,
    },
    time / 1000
  );
  summary.observe(
    {
      method,
      path,
      statusCode,
    },
    time / 1000
  );
  counter.inc({ method, path, statusCode });
});
