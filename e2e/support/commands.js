// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { CONNECTION_STRING } from './database';

Cypress.Commands.add('getByCy', (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
});

Cypress.Commands.add('executeQuery', (query) => {
  return cy.task("dbQuery", {query, "connection" : CONNECTION_STRING});
});

Cypress.Commands.add('stubNewWindow', () => {
  cy.window().then(win => {
    cy.stub(win, 'open').callsFake(link => {
      win.location.href = link;
    });
  });
});
