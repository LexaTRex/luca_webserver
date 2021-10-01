import {
  E2E_HEALTH_DEPARTMENT_USERNAME,
  E2E_HEALTH_DEPARTMENT_PASSWORD,
} from '../../helper/user';
import { logout } from '../../helper/api/auth.helper';
import {
  loginToHD,
  openHDLoginPage,
  uploadWrongHealthDepartmentPrivateKeyFileType,
  uploadWrongHealthDepartmentPrivateKeyFile,
  uploadWrongHealthDepartmentPrivateKeyFileTypeReUploadCorrectFile,
  uploadHealthDepartmentPrivateKeyFileLargeSize,
} from '../../helper/ui/login.helper';

const appTracking = '/app/tracking';

const testSetup = () => {
  openHDLoginPage();
  loginToHD(E2E_HEALTH_DEPARTMENT_USERNAME, E2E_HEALTH_DEPARTMENT_PASSWORD);
  cy.url().should('include', appTracking);
};

describe('Authentication', () => {
  describe('Health Department / Authentication / Login / Private key upload', () => {
    describe('When uploading a wrong key', () => {
      describe('When Uploading private key file that is too large', () => {
        it('A notification occours stating that the key is too large', () => {
          testSetup();
          uploadHealthDepartmentPrivateKeyFileLargeSize();
          cy.get('.ant-notification-notice', { timeout: 10000 }).should(
            'be.visible'
          );
          cy.get('.ant-modal').should('exist');
          logout();
        });
      });
      describe('When uploading a Private key that has the wrong key format', () => {
        it('A notification occours stating that a wrong key file has been uploaded', () => {
          testSetup();
          uploadWrongHealthDepartmentPrivateKeyFileType();
          cy.get('.ant-notification-notice', { timeout: 10000 }).should(
            'be.visible'
          );
          cy.get('.ant-modal').should('exist');
          logout();
        });
      });
      describe('When uploading a wrong Private key', () => {
        it('it will reject the private key file and a notification should occur stating that a wrong key has been uploaded', () => {
          testSetup();
          uploadWrongHealthDepartmentPrivateKeyFile();
          cy.get('.ant-notification-notice', { timeout: 10000 }).should(
            'be.visible'
          );
          cy.get('.ant-modal').should('exist');
          logout();
        });
      });
    });
    describe('Try again key Re-upload', () => {
      describe('When uploading a Wrong private key and afterwards re-upload a correct private key', () => {
        it('it should reject the key upload and a notification should show stating that a wrong key has been uploaded, after that the correct private key is being uploaded and a notification occurs stating the the private key has been successfully uploaded as well the modal should close', () => {
          testSetup();
          uploadWrongHealthDepartmentPrivateKeyFileTypeReUploadCorrectFile();
          cy.getByCy('header')
            .contains('Health-Department')
            .should('exist')
            .should('be.visible');
          cy.getByCy('linkMenu').should('exist').should('be.visible');
          cy.get('button').contains('LOG OUT').should('exist');

          cy.get('.ant-menu-horizontal').should('exist').should('be.visible');
          cy.getByCy('navigation').should('exist').should('be.visible');
          logout();
        });
      });
    });
  });
});
