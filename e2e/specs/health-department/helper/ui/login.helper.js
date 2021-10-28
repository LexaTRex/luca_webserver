/* eslint-disable */
import { HEALTH_DEPARTMENT_BASE_ROUTE } from '../../constants/routes';

export const openHDLoginPage = () => {
  if (Cypress.env('envName') !== 'local') {
    cy.visit(HEALTH_DEPARTMENT_BASE_ROUTE, {
      auth: {
        username: Cypress.env('basicAuthName'),
        password: Cypress.env('basicAuthPassword'),
      },
    });
  } else {
    cy.visit(HEALTH_DEPARTMENT_BASE_ROUTE);
  }
};

export const verifyLoggedIn = () => {
  cy.getByCy('header')
    .contains('Health-Department')
    .should('exist')
    .should('be.visible');
  cy.getByCy('linkMenu').should('exist').should('be.visible');
  cy.get('button').contains('LOG OUT').should('exist');

  cy.get('.ant-menu-horizontal').should('exist').should('be.visible');
  cy.getByCy('navigation').should('exist').should('be.visible');
};
