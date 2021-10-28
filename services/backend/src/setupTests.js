/* eslint-disable mocha/no-top-level-hooks */
// https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-top-level-hooks.md
// doesn't apply to global test setups

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const chaiArrays = require('chai-arrays');
const { database } = require('./database');
const { configureApp } = require('./app');
const { gracefulShutdown } = require('./utils/lifecycle');

chai.should();
chai.use(chaiHttp);
chai.use(chaiAsPromised);
chai.use(chaiArrays);

before(async () => {
  await database.sync();
  configureApp(database);
});

after(async () => {
  await gracefulShutdown(true);
});
