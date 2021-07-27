import { logout, downloadLocationPrivateKeyFile } from '../../helpers/functions';
import { E2E_EMAIL, E2E_PASSWORD } from '../../helpers/users';
import { RESET_LOCATION_KEY_QUERY } from '../../helpers/dbQueries';
import { enterEmail, enterPassword } from '../authentication.helper';

describe('Location / Authentication / Login', () => {
  before(() => {
    cy.executeQuery(RESET_LOCATION_KEY_QUERY);
  });
  beforeEach(() => cy.visit('/'));
  afterEach(() => logout());

  describe('Login as an operator for the first time and download private key', () => {
    it('display location home page', () => {
      enterEmail(E2E_EMAIL);
      enterPassword(E2E_PASSWORD);
      cy.getByCy('loginError').should('not.exist');
      downloadLocationPrivateKeyFile();
    });
  });
  describe('Login as an operator with wrong password', () => {
    it('does not log in an existing user', () => {
      enterEmail(E2E_EMAIL);
      enterPassword('WRONG_PASSWORD');
      cy.getByCy('loginError').should('exist');
    });
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