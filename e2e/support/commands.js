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
} from '../specs/health-department/constants/user';
import { createGroupPayload } from '../specs/locations/utils/payloads.helper';
import {
  APP_ROUTE,
  LOCATION_GROUPS_ROUTE,
} from '../specs/locations/constants/routes';
import 'cypress-fill-command';

Cypress.Commands.add('getByCy', (selector, ...arguments_) => {
  return cy.get(`[data-cy="${selector}"]`, ...arguments_);
});

Cypress.Commands.add('executeQuery', query => {
  return cy.task('dbQuery', { query, connection: CONNECTION_STRING });
});

Cypress.Commands.add('stubNewWindow', () => {
  cy.window().then(win => {
    cy.stub(win, 'open').callsFake(link => {
      // eslint-disable-next-line no-param-reassign
      win.location.href = link;
    });
  });
});

// eslint-disable-next-line consistent-return
Cypress.Commands.overwrite('visit', (originalFunction, url, options) => {
  if (url.includes(':9443')) {
    cy.window().then(win => {
      return win.open(url, '_self');
    });
  } else {
    return originalFunction(url, options);
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
      Authorization: `Basic ${btoa(
        `${Cypress.env('basicAuthName')}:${Cypress.env('basicAuthPassword')}`
      )}`,
    },
  });
});

// Groups
Cypress.Commands.add(
  'createGroup',
  (group = createGroupPayload, redirect = true) => {
    cy.request('POST', `${LOCATION_GROUPS_ROUTE}/`, group).then(
      // eslint-disable-next-line require-await
      async response => {
        const { groupId, name, location } = response.body;
        cy.wrap(response.body).as('group');
        cy.wrap(name).as('groupName');
        cy.wrap(groupId).as('groupId');
        cy.wrap(location.scannerId).as('scannerId');
        if (redirect) {
          // eslint-disable-next-line promise/no-nesting
          cy.request('GET', `${LOCATION_GROUPS_ROUTE}/${groupId}`).then(
            // eslint-disable-next-line no-shadow
            response => {
              const { locations } = response.body;
              cy.wrap(response.body).as('group');
              cy.visit(`${APP_ROUTE}/${groupId}/location/${locations[0].uuid}`);
            }
          );
        }
        return response;
      }
    );
  }
);
