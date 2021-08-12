import {
  logout,
  downloadLocationPrivateKeyFile,
  uploadLocationPrivateKeyFile,
} from '../../helpers/functions';
import {
  E2E_EMAIL,
  E2E_PASSWORD,
  E2E_LOCATION_PRIVATE_KEY_PATH,
  E2E_LOCATION_PRIVATE_KEY_NAME,
  E2E_LOCATION_WRONG_PRIVATE_KEY_PATH,
  E2E_LOCATION_WRONG_PRIVATE_KEY_NAME,
} from '../../helpers/users';
import { RESET_LOCATION_KEY_QUERY } from '../../helpers/dbQueries';
import { enterEmail, enterPassword } from '../authentication.helper';

describe('Location / Authentication / Login', () => {
  before(() => {
    cy.executeQuery(RESET_LOCATION_KEY_QUERY);
  });
  beforeEach(() => cy.visit('/'));
  afterEach(() => logout());

  describe('Login as an operator for the first time and download a private key, after downloading the private key upload a wrong key and go back to download another key', () => {
    it('should show an error notification stating that the key is wrong to go back to regenerate a new download key', () => {
      enterEmail(E2E_EMAIL);
      enterPassword(E2E_PASSWORD);
      cy.getByCy('loginError').should('not.exist');
      cy.wait(1000);
      downloadLocationPrivateKeyFile();
      uploadLocationPrivateKeyFile(
        E2E_LOCATION_WRONG_PRIVATE_KEY_PATH,
        E2E_LOCATION_WRONG_PRIVATE_KEY_NAME
      );
      cy.wait(1000);
      cy.getByCy('regenerateKey').should('exist');
      cy.getByCy('regenerateKey', { timeout: 1000 }).click();
      downloadLocationPrivateKeyFile();
      cy.get('.ant-notification-notice-content').should('exist');
    });
  });
  describe('Login as an operator for the first time and download private key, after downloading private double check if it is the correct key', () => {
    it('should close the modal successfully', () => {
      enterEmail(E2E_EMAIL);
      enterPassword(E2E_PASSWORD);
      cy.getByCy('loginError').should('not.exist');
      cy.wait(1000);
      downloadLocationPrivateKeyFile();
      cy.wait(1000);
      uploadLocationPrivateKeyFile(
        E2E_LOCATION_PRIVATE_KEY_PATH,
        E2E_LOCATION_PRIVATE_KEY_NAME
      );
      cy.getByCy('complete', { timeout: 1000 }).click();
      cy.get('.ant-modal-body').should('not.exist');
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
