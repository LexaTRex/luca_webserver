import { E2E_FIRSTNAME, E2E_LASTNAME, E2E_PASSWORD } from '../constants/users';

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

export const requestAccountDeletion = () => {
  return cy.request('DELETE', 'api/v3/operators');
};

export const undoAccountDeletion = () => {
  return cy.request('POST', 'api/v3/operators/restore');
};

export async function getMe() {
  cy.request('GET', '/api/v3/auth/me').then(async response => {
    cy.wrap(response.body).as('operator');
    return response;
  });
}
