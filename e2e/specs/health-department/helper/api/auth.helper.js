import { HEALTH_DEPARTMENT_APP_ROUTE } from '../routes';
import {
  E2E_HEALTH_DEPARTMENT_USERNAME,
  E2E_HEALTH_DEPARTMENT_PASSWORD,
} from '../user';

export const loginHealthDepartment = () => {
  cy.request({
    method: 'POST',
    url: 'api/v3/auth/healthDepartmentEmployee/login',
    body: {
      username: E2E_HEALTH_DEPARTMENT_USERNAME,
      password: E2E_HEALTH_DEPARTMENT_PASSWORD,
    },
    headers: {
      origin: Cypress.config().baseUrl,
      host: Cypress.env('host'),
    },
  });

  cy.visit(HEALTH_DEPARTMENT_APP_ROUTE);
};

export const logout = () => {
  cy.request({
    method: 'POST',
    url: 'api/v3/auth/logout',
    headers: {
      origin: Cypress.config().baseUrl,
      host: Cypress.env('host'),
      Authorization:
        'Basic ' +
        btoa(
          Cypress.env('basicAuthName') + ':' + Cypress.env('basicAuthPassword')
        ),
    },
  });
};
