import { APP_ROUTE, LOCATION_GROUPS_ROUTE } from './routes';
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
  basicLocationLogin();
  cy.visit(route ? route : APP_ROUTE);
};

export const basicLocationLogin = (
  username = E2E_EMAIL,
  password = E2E_PASSWORD,
  closeModal = true
) => {
  cy.request({
    method: 'POST',
    url: 'api/v3/auth/login',
    body: {
      username,
      password,
    },
    headers: {
      host: 'localhost',
      origin: 'https://localhost',
    },
  });
  cy.server();
  cy.intercept({ method: 'GET', url: '**/me' }).as('me');
  cy.visit(APP_ROUTE);
  cy.window().then(window => {
    window.sessionStorage.clear();
    cy.reload();
  });
  cy.wait('@me');
  if (closeModal) {
    cy.get('.ant-modal-close-x').click();
  }
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
    lang: 'de',
  });
};

export const resetGroupName = () => {
  cy.request(
    'PATCH',
    `${LOCATION_GROUPS_ROUTE}/${E2E_DEFAULT_LOCATION_GROUP}`,
    {
      name: E2E_DEFAULT_GROUP_NAME,
    }
  );
};

export const createGroup = (group = createGroupPayload, redirect = true) => {
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
};

export const deleteGroup = groupId => {
  return cy.request('DELETE', `api/v3/locationGroups/${groupId}`);
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

export const checkin = traceDataPayload => {
  cy.request('POST', `/api/v3/traces/checkin`, traceDataPayload);
};

export const requestAccountDeletion = () => {
  return cy.request('DELETE', 'api/v3/operators');
};

export const undoAccountDeletion = () => {
  return cy.request('POST', 'api/v3/operators/restore');
};

export const downloadLocationPrivateKeyFile = () => {
  cy.getByCy('downloadPrivateKey', { timeout: 8000 }).click();
  cy.getByCy('checkPrivateKeyIsDownloaded').click();
  cy.getByCy('next').should('exist').click();
};

export const uploadLocationPrivateKeyFile = (filename, name) => {
  cy.readFile(filename).then(fileContent => {
    cy.get('input[type=file]').attachFile({
      fileContent,
      mimeType: 'text/plain',
      fileName: name,
    });
  });
};

export const skipLocationPrivateKeyFile = () => {
  cy.get('.ant-modal-content').within($modal => {
    cy.getByCy('skipPrivateKeyUpload')
      .should('exist')
      .should('be.visible')
      .click();
  });
};

export const checkoutGuests = () => {
  cy.getByCy('checkoutGuest').click();
  cy.get('.ant-popover-buttons .ant-btn-primary').click();
  cy.get('.successCheckout').should('exist');
};
