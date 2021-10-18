import { loginHealthDepartment } from '../../helper/api/auth.helper';
import {
  uploadWrongHealthDepartmentPrivateKeyFileType,
  uploadWrongHealthDepartmentPrivateKeyFile,
  uploadWrongHealthDepartmentPrivateKeyFileTypeReUploadCorrectFile,
  uploadHealthDepartmentPrivateKeyFileLargeSize,
} from '../../helper/ui/login.helper';

describe('Authentication', () => {
  describe('Health Department / Authentication / Login / Private key upload', () => {
    describe('When uploading a wrong key', () => {
      describe('When Uploading private key file that is too large', () => {
        it('A notification occours stating that the key is too large', () => {
          loginHealthDepartment();
          uploadHealthDepartmentPrivateKeyFileLargeSize();
          cy.get('.ant-notification-notice', { timeout: 10000 }).should(
            'be.visible'
          );
          cy.get('.ant-modal').should('exist');
          cy.logoutHD();
        });
      });
      describe('When uploading a Private key that has the wrong key format', () => {
        it('A notification occours stating that a wrong key file has been uploaded', () => {
          loginHealthDepartment();
          uploadWrongHealthDepartmentPrivateKeyFileType();
          cy.get('.ant-notification-notice', { timeout: 10000 }).should(
            'be.visible'
          );
          cy.get('.ant-modal').should('exist');
          cy.logoutHD();
        });
      });
      describe('When uploading a wrong Private key', () => {
        it('it will reject the private key file and a notification should occur stating that a wrong key has been uploaded', () => {
          loginHealthDepartment();
          uploadWrongHealthDepartmentPrivateKeyFile();
          cy.get('.ant-notification-notice', { timeout: 10000 }).should(
            'be.visible'
          );
          cy.get('.ant-modal').should('exist');
          cy.logoutHD();
        });
      });
    });
    describe('Try again key Re-upload', () => {
      describe('When uploading a Wrong private key and afterwards re-upload a correct private key', () => {
        it('it should reject the key upload and a notification should show stating that a wrong key has been uploaded, after that the correct private key is being uploaded and a notification occurs stating the the private key has been successfully uploaded as well the modal should close', () => {
          loginHealthDepartment();
          uploadWrongHealthDepartmentPrivateKeyFileTypeReUploadCorrectFile();
          cy.getByCy('header')
            .contains('Health-Department')
            .should('exist')
            .should('be.visible');
          cy.getByCy('linkMenu').should('exist').should('be.visible');
          cy.get('button').contains('LOG OUT').should('exist');

          cy.get('.ant-menu-horizontal').should('exist').should('be.visible');
          cy.getByCy('navigation').should('exist').should('be.visible');
          cy.logoutHD();
        });
      });
    });
  });
});
