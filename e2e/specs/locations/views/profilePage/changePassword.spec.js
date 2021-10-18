import { loginLocations } from '../../utils/auth';
import { PROFILE_ROUTE } from '../../constants/routes';
import { E2E_PASSWORD, E2E_EMAIL } from '../../constants/users';
import { resetPassword } from '../../utils/operators';

const NEW_PASSWORD = 'Nexenio123!';

describe('Change Operator Password', () => {
  beforeEach(() => {
    loginLocations(E2E_EMAIL, E2E_PASSWORD, PROFILE_ROUTE);
  });
  afterEach(() => resetPassword(NEW_PASSWORD));
  it('is possible to change password and login with new password', () => {
    cy.get('#currentPassword').should('exist').and('have.value', '');
    cy.get('#newPassword').should('exist').and('have.value', '');
    cy.get('#newPasswordConfirm').should('exist').and('have.value', '');
    // Change password
    cy.get('#currentPassword').type(E2E_PASSWORD);
    cy.get('#newPassword').type(NEW_PASSWORD);
    cy.get('#newPasswordConfirm').type(NEW_PASSWORD);
    cy.getByCy('changePassword').click();
    // Logout
    cy.logoutLocations().then(response => {
      expect(response.status).to.eq(204);
    });
    cy.visit('/');
    // Old login does not work anymore
    cy.basicLoginLocations().then(response => {
      expect(response.status).to.eq(401);
    });
    // Logging in with new password
    cy.basicLoginLocations(E2E_EMAIL, NEW_PASSWORD).then(response => {
      expect(response.status).to.eq(200);
    });
  });
});
