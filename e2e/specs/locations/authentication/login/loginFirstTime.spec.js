import {
  E2E_EMAIL,
  E2E_LOCATION_PRIVATE_KEY_PATH,
  E2E_LOCATION_PRIVATE_KEY_NAME,
  E2E_LOCATION_WRONG_PRIVATE_KEY_PATH,
  E2E_LOCATION_WRONG_PRIVATE_KEY_NAME,
} from '../../constants/users';
import { RESET_LOCATION_KEY_QUERY } from '../../constants/dbQueries';
import { enterEmail, enterPassword } from '../authentication.helper';
import { APP_ROUTE } from '../../constants/routes';
import {
  downloadLocationPrivateKeyFile,
  uploadLocationPrivateKeyFile,
} from '../../ui-helpers/handlePrivateKeyFile';

describe('Location / Authentication / Login', () => {
  before(() => {
    cy.executeQuery(RESET_LOCATION_KEY_QUERY);
  });
  afterEach(() => cy.logoutLocations());

  describe('Login as an operator for the first time and download a private key, after downloading the private key upload a wrong key and go back to download another key', () => {
    it('should show an error notification stating that the key is wrong to go back to regenerate a new download key', () => {
      cy.basicLoginLocations();
      cy.visit(APP_ROUTE);
      downloadLocationPrivateKeyFile();
      uploadLocationPrivateKeyFile(
        E2E_LOCATION_WRONG_PRIVATE_KEY_PATH,
        E2E_LOCATION_WRONG_PRIVATE_KEY_NAME
      );
      cy.getByCy('regenerateKey').should('exist');
      cy.getByCy('regenerateKey', { timeout: 1000 }).click();
      downloadLocationPrivateKeyFile();
      cy.get('.ant-notification-notice-content').should('exist');
    });
  });
  describe('Login as an operator for the first time and download private key, after downloading private double check if it is the correct key', () => {
    it('should close the modal successfully', () => {
      cy.basicLoginLocations();
      cy.visit(APP_ROUTE);
      downloadLocationPrivateKeyFile();
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
      cy.visit('/');
      enterEmail(E2E_EMAIL);
      enterPassword('WRONG_PASSWORD');
      cy.getByCy('loginError').should('exist');
    });
  });
  describe('Forgot password', () => {
    it('redirects to forgot password page', () => {
      cy.visit('/');
      enterEmail(E2E_EMAIL);
      enterPassword('WRONG_PASSWORD');
      cy.getByCy('loginError').should('exist');
      cy.getByCy('forgotPasswordPage').should('not.exist');
      cy.getByCy('forgotPasswordLink').click();
      cy.getByCy('forgotPasswordPage').should('exist');
    });
  });
});
