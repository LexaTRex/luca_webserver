import { login, logout, resetPassword } from '../helpers/functions';
import { PROFILE_ROUTE } from '../helpers/routes';
import { E2E_PASSWORD, E2E_EMAIL } from '../helpers/users';
import {
  enterEmail,
  enterPassword,
} from '../authentication/authentication.helper';

const NEW_PASSWORD = 'Nexenio123!';

describe('Change Operator Password', () => {
  beforeEach(() => login(PROFILE_ROUTE));
  afterEach(() => resetPassword(NEW_PASSWORD));
  it('is possible to change password and login with new password', () => {
    cy.get('#currentPassword').should('have.value', '');
    cy.get('#newPassword').should('have.value', '');
    cy.get('#newPasswordConfirm').should('have.value', '');
    // Change password
    cy.get('#currentPassword').type(E2E_PASSWORD);
    cy.get('#newPassword').type(NEW_PASSWORD);
    cy.get('#newPasswordConfirm').type(NEW_PASSWORD);
    cy.getByCy('changePassword').click();
    // Logout
    logout();
    // Old login does not work anymore
    enterEmail(E2E_EMAIL);
    enterPassword(E2E_PASSWORD);
    cy.getByCy('loginError').should('exist');
    cy.get('#password').clear();
    // New Password
    enterPassword(NEW_PASSWORD);
    cy.getByCy('loginError').should('not.exist');
  });
});
