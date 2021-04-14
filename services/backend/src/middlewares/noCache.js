const noCache = (request, response, next) => {
  response.setHeader('Cache-Control', 'no-cache');
  next();
};

module.exports = {
  noCache,
};
