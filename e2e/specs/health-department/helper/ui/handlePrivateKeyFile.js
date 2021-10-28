/* eslint-disable */
import {
  HD_CORRECT_PRIVATE_KEY_FILE_NAME,
  HD_LARGE_PRIVATE_KEY_FILE_NAME,
  HD_WRONG_PRIVATE_KEY_FILE_NAME,
  HEALTH_DEPARTMENT_LARGE_SIZE_FILE_PRIVATE_KEY_PATH,
  HEALTH_DEPARTMENT_PRIVATE_KEY_PATH,
  HEALTH_DEPARTMENT_WRONG_PDF_FILE_PATH,
  HEALTH_DEPARTMENT_WRONG_PRIVATE_KEY_PATH,
} from '../../constants/keyFiles';

export const readHDPrivateKeyFile = (filepath, filename) => {
  cy.readFile(filepath).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent,
      fileName: filename,
      mimeType: 'text/plain',
    });
  });
};

export const downloadHealthDepartmentPrivateKey = () => {
  cy.get('.ant-modal').should('exist');
  cy.getByCy('downloadPrivateKey', { timeout: 8000 }).click();
  cy.getByCy('next').should('exist');
  cy.getByCy('next').click();
  cy.getByCy('finish').should('exist');
  cy.getByCy('finish').click();
};

export const uploadHealthDepartmentPrivateKeyFile = () => {
  cy.get('.ant-modal').should('exist');
  readHDPrivateKeyFile(
    HEALTH_DEPARTMENT_PRIVATE_KEY_PATH,
    HD_CORRECT_PRIVATE_KEY_FILE_NAME
  );
};

export const uploadHealthDepartmentPrivateKeyFileLargeSize = () => {
  cy.get('.ant-modal').should('exist');
  readHDPrivateKeyFile(
    HEALTH_DEPARTMENT_LARGE_SIZE_FILE_PRIVATE_KEY_PATH,
    HD_LARGE_PRIVATE_KEY_FILE_NAME
  );
};

export const uploadWrongHealthDepartmentPrivateKeyFile = () => {
  cy.get('.ant-modal').should('exist');
  readHDPrivateKeyFile(
    HEALTH_DEPARTMENT_WRONG_PRIVATE_KEY_PATH,
    HD_WRONG_PRIVATE_KEY_FILE_NAME
  );
};

export const removeHealthDepartmentPrivateKeyFile = () => {
  cy.task('deleteFileIfExists', HEALTH_DEPARTMENT_PRIVATE_KEY_PATH);
};

export const uploadWrongHealthDepartmentPrivateKeyFileType = () => {
  cy.get('.ant-modal').should('exist');
  cy.readFile(HEALTH_DEPARTMENT_WRONG_PDF_FILE_PATH).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent,
      fileName: 'dummy.pdf',
      mimeType: 'application/pdf',
    });
  });
};

export const uploadWrongHealthDepartmentPrivateKeyFileTypeReUploadCorrectFile = () => {
  cy.get('.ant-modal').should('exist');
  readHDPrivateKeyFile(
    HEALTH_DEPARTMENT_WRONG_PRIVATE_KEY_PATH,
    HD_WRONG_PRIVATE_KEY_FILE_NAME
  );
  cy.get('.ant-notification-notice', { timeout: 10000 }).should('be.visible');
  cy.get('.ant-modal').should('exist');

  cy.getByCy('tryAgain', { timeout: 1000 }).should('exist');
  cy.getByCy('tryAgain').click();
  readHDPrivateKeyFile(
    HEALTH_DEPARTMENT_PRIVATE_KEY_PATH,
    HD_CORRECT_PRIVATE_KEY_FILE_NAME
  );
  cy.get('.ant-modal', { timeout: 1000 }).should('not.exist');
};

export const addHealthDepartmentPrivateKeyFile = () => {
  cy.task('fileExists', HEALTH_DEPARTMENT_PRIVATE_KEY_PATH).then(exists => {
    if (!exists) {
      cy.log('Private key should be downloaded');
      downloadHealthDepartmentPrivateKey();
    } else {
      uploadHealthDepartmentPrivateKeyFile();
    }
  });
};
