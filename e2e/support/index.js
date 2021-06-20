// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

import 'cypress-file-upload';

beforeEach(() => {
  cy.intercept('/', req => {
    req.headers['X-Forwarded-For'] = '10.0.0.1';
  });
});

Cypress.on('uncaught:exception', err => {
  // returning false here prevents Cypress from failing the test
  // deal with issue https://github.com/quasarframework/quasar/issues/2233
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
