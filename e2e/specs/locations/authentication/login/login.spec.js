import { logout } from '../../helpers/functions';
import { E2E_EMAIL, E2E_PASSWORD } from '../../helpers/users';
import { enterEmail, enterPassword } from '../authentication.helper';

describe('Autentication', () => {
  beforeEach(() => cy.visit('/'));
  afterEach(() => logout());
  describe('Login', () => {
    describe('Correct password', () => {
      it('logs in an existing user', () => {
        enterEmail(E2E_EMAIL);
        enterPassword(E2E_PASSWORD);
        cy.getByCy('loginError').should('not.exist');
      });
    });
    describe('Wrong password', () => {
      it('does not log in an existing user', () => {
        enterEmail(E2E_EMAIL);
        enterPassword('WRONG_PASSWORD');
        cy.getByCy('loginError').should('exist');
      });
      describe('Forgot password', () => {
        it('redirects to forgot password page', () => {
          enterEmail(E2E_EMAIL);
          enterPassword('WRONG_PASSWORD');
          cy.getByCy('loginError').should('exist');
          cy.getByCy('forgotPasswordPage').should('not.exist');
          cy.getByCy('forgotPasswordLink').click();
          cy.getByCy('forgotPasswordPage').should('exist');
        });
      });
    });
  });
});
