import { APP_ROUTE } from './routes';
import { E2E_EMAIL, E2E_PASSWORD, E2E_LASTNAME, E2E_FIRSTNAME } from './users';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  E2E_DEFAULT_GROUP_NAME,
} from './locations';
import {
  createGroupPayload,
  getCreateLocationPayload,
} from './functions.helper';

export const login = route => {
  basicLogin();
  cy.visit(route ? route : APP_ROUTE);
};

export const basicLogin = route => {
  cy.request({
    method: 'POST',
    url: 'api/v3/auth/login',
    body: {
      username: E2E_EMAIL,
      password: E2E_PASSWORD,
    },
    headers: {
      host: 'localhost',
      origin: 'https://localhost',
    },
  });
  cy.visit(route ? route : APP_ROUTE);
  cy.window().then(window => {
    window.sessionStorage.setItem('PRIVATE_KEY_MODAL_SEEN', 'true');
  });
};

export const logout = () => {
  cy.request({
    method: 'POST',
    url: 'api/v3/auth/logout',
    headers: {
      host: 'localhost',
      origin: 'https://localhost',
    },
  });

  cy.visit('/');
};

export const resetUserName = () => {
  cy.request('PATCH', 'api/v3/operators', {
    firstName: E2E_FIRSTNAME,
    lastName: E2E_LASTNAME,
  });
};

export const resetPassword = currentPassword => {
  cy.request('POST', 'api/v3/operators/password/change', {
    currentPassword,
    newPassword: E2E_PASSWORD,
  });
};

export const resetGroupName = () => {
  cy.request('PATCH', `api/v3/locationGroups/${E2E_DEFAULT_LOCATION_GROUP}`, {
    name: E2E_DEFAULT_GROUP_NAME,
  });
};

export const createGroup = () => {
  cy.request('POST', 'api/v3/locationGroups/', createGroupPayload).then(
    async response => {
      cy.request('GET', `api/v3/locationGroups/${response.body.groupId}`).then(
        response => {
          cy.visit(
            `${APP_ROUTE}/${response.body.groupId}/location/${response.body.locations[0].uuid}`
          );
        }
      );
    }
  );
};

export const createLocation = (groupId, locationName) => {
  cy.request(
    'POST',
    'api/v3/operators/locations/',
    getCreateLocationPayload(groupId, locationName)
  ).then(async response => {
    cy.request('GET', `api/v3/operators/locations/${response.body.uuid}`).then(
      response => {
        cy.visit(
          `${APP_ROUTE}/${response.body.groupId}/location/${response.body.uuid}`
        );
      }
    );
  });
};

export const contactFormCheckin = traceDataPayload => {
  cy.request('POST', '/api/v3/traces/checkin', traceDataPayload);
};

export const requestAccountDeletion = () => {
  return cy.request('DELETE', 'api/v3/operators');
};

export const undoAccountDeletion = () => {
  return cy.request('POST', 'api/v3/operators/restore');
};
