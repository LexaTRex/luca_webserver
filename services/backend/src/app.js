const config = require('config');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('express-async-errors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const helmet = require('helmet');
const expressWinston = require('express-winston');
const database = require('./database');
const logger = require('./utils/logger');

const error = require('./middlewares/error');
const { noCache } = require('./middlewares/noCache');

const passportSession = require('./passport/session');
const bearerBadgeGeneratorStrategy = require('./passport/bearerBadgeGenerator');
const localOperatorStrategy = require('./passport/localOperator');
const localHealthDepartmentEmployeeStrategy = require('./passport/localHealthDepartmentEmployee');

// Routes
const versionRouter = require('./routes/version');
const licensesRouter = require('./routes/licenses');
const internalRouter = require('./routes/internal');
const v2Router = require('./routes/v2');
const v3Router = require('./routes/v3');
const v4Router = require('./routes/v4');

let app;

const getApp = () => {
  return app;
};

const configureApp = () => {
  // Passport Strategies
  passport.serializeUser(passportSession.serializeUser);
  passport.deserializeUser(passportSession.deserializeUser);
  passport.use('bearer-badgeGenerator', bearerBadgeGeneratorStrategy);
  passport.use('local-operator', localOperatorStrategy);
  passport.use(
    'local-healthDepartmentEmployee',
    localHealthDepartmentEmployeeStrategy
  );

  app = express();
  const router = express.Router();

  const sequelizeStore = new SequelizeStore({
    db: database,
  });

  sequelizeStore.sync();

  // Logging
  const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
    ignoredRoutes: [
      '/api/v3/health',
      '/api/v3/health/ready',
      '/api/internal/metrics',
    ],
  });
  const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
  });

  app.disable('x-powered-by');
  app.enable('strict routing');
  app.set('trust proxy', 2);

  // Global Middlewares
  app.use(requestLogger);
  if (!config.get('debug')) {
    app.use(helmet.hsts());
  }
  app.use(cookieParser());
  app.use(
    session({
      secret: config.get('cookies.secret'),
      name: `__Secure-${config.get('cookies.name')}`,
      store: sequelizeStore,
      resave: true,
      rolling: true,
      saveUninitialized: false,
      unset: 'destroy',
      cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.get('cookies.maxAge'),
        path: config.get('cookies.path'),
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(noCache);

  app.use('/api', router);
  app.use(errorLogger);
  app.use(error.handle404);
  app.use(error.handle500);

  // Routing
  router.use('/version', versionRouter);
  router.use('/licenses', licensesRouter);
  router.use('/internal', internalRouter);
  router.use('/v2', v2Router);
  router.use('/v3', v3Router);
  router.use('/v4', v4Router);

  return app;
};

module.exports = { configureApp, getApp };
