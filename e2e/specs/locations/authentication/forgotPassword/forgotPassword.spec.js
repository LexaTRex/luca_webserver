import { E2E_EMAIL } from '../../helpers/users';
import { enterEmail } from '../authentication.helper';

describe('Forgot password', () => {
  beforeEach(() => cy.visit('/'));
  it('can sent the reset password email and redirect the user back to the login page', () => {
    enterEmail(E2E_EMAIL);
    cy.get('#password').should('exist');
    cy.getByCy('forgotPasswordLink').click();
    cy.getByCy('forgotPasswordPage').should('exist');
    // Check the email prefill
    cy.get('#email').invoke('val').should('exist');
    cy.getByCy('sentResetLinkSubmit').click();
    cy.get('.ant-notification-notice-message').should('exist');
    cy.getByCy('loginPage').should('exist');
    cy.get('#email').should('exist');
  });
});
