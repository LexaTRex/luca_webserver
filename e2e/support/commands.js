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
import { E2E_EMAIL, E2E_PASSWORD } from '../specs/locations/constants/users';
import {
  E2E_HEALTH_DEPARTMENT_PASSWORD,
  E2E_HEALTH_DEPARTMENT_USERNAME,
} from '../specs/health-department/helper/user';
import { createGroupPayload } from '../specs/locations/utils/payloads.helper';
import {
  APP_ROUTE,
  LOCATION_GROUPS_ROUTE,
} from '../specs/locations/constants/routes';

Cypress.Commands.add('getByCy', (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
});

Cypress.Commands.add('executeQuery', query => {
  return cy.task('dbQuery', { query, connection: CONNECTION_STRING });
});

Cypress.Commands.add('stubNewWindow', () => {
  cy.window().then(win => {
    cy.stub(win, 'open').callsFake(link => {
      win.location.href = link;
    });
  });
});

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  if (url.includes(':9443')) {
    cy.window().then(win => {
      return win.open(url, '_self');
    });
  } else {
    return originalFn(url, options);
  }
});

// Locations
Cypress.Commands.add(
  'basicLoginLocations',
  (username = E2E_EMAIL, password = E2E_PASSWORD) => {
    cy.request({
      method: 'POST',
      url: 'api/v3/auth/login',
      failOnStatusCode: false,
      body: {
        username,
        password,
      },
      headers: {
        host: 'localhost',
        origin: 'https://localhost',
      },
    });
  }
);

Cypress.Commands.add('logoutLocations', () => {
  cy.request({
    method: 'POST',
    url: 'api/v3/auth/logout',
    headers: {
      host: 'localhost',
      origin: 'https://localhost',
    },
  });
});

// Health Department
Cypress.Commands.add(
  'basicLoginHD',
  (
    username = E2E_HEALTH_DEPARTMENT_USERNAME,
    password = E2E_HEALTH_DEPARTMENT_PASSWORD
  ) => {
    cy.request({
      method: 'POST',
      url: 'api/v3/auth/healthDepartmentEmployee/login',
      failOnStatusCode: false,
      body: {
        username,
        password,
      },
      headers: {
        origin: Cypress.config().baseUrl,
        host: Cypress.env('host'),
      },
    });
  }
);

Cypress.Commands.add('logoutHD', () => {
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
});

// Groups
Cypress.Commands.add(
  'createGroup',
  (group = createGroupPayload, redirect = true) => {
    cy.request('POST', `${LOCATION_GROUPS_ROUTE}/`, group).then(
      async response => {
        const groupId = response.body.groupId;
        cy.wrap(response.body).as('group');
        cy.wrap(response.body.name).as('groupName');
        cy.wrap(response.body.groupId).as('groupId');
        cy.wrap(response.body.location.scannerId).as('scannerId');
        if (redirect) {
          cy.request('GET', `${LOCATION_GROUPS_ROUTE}/${groupId}`).then(
            response => {
              cy.wrap(response.body).as('group');
              cy.visit(
                `${APP_ROUTE}/${groupId}/location/${response.body.locations[0].uuid}`
              );
            }
          );
        }
        return response;
      }
    );
  }
);
