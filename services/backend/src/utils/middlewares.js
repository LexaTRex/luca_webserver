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

const combineMiddlewares = middlewares => async (request, response, next) => {
  for (const middleware of middlewares) {
    await waitForMiddleware(middleware, request, response);
  }
  next();
};

module.exports = {
  combineMiddlewares,
  waitForMiddleware,
};
