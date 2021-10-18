import {
  HEALTH_DEPARTMENT_PRIVATE_KEY_PATH,
  HEALTH_DEPARTMENT_WRONG_PRIVATE_KEY_PATH,
  HEALTH_DEPARTMENT_WRONG_FILE_PRIVATE_KEY_PATH,
  HEALTH_DEPARTMENT_LARGE_SIZE_FILE_PRIVATE_KEY_PATH,
} from '../user';
import { HEALTH_DEPARTMENT_BASE_ROUTE } from '../../helper/routes';

export const openHDLoginPage = () => {
  if (Cypress.env('envName') != 'local') {
    cy.visit(HEALTH_DEPARTMENT_BASE_ROUTE, {
      auth: {
        username: Cypress.env('basicAuthName'),
        password: Cypress.env('basicAuthPassword'),
      },
    });
  } else {
    cy.visit(HEALTH_DEPARTMENT_BASE_ROUTE);
  }
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
  cy.readFile(HEALTH_DEPARTMENT_PRIVATE_KEY_PATH).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent,
      fileName: 'HealthDepartmentKeyFile.luca',
      mimeType: 'text/plain',
    });
  });
};

export const uploadHealthDepartmentPrivateKeyFileLargeSize = () => {
  cy.get('.ant-modal').should('exist');
  cy.readFile(HEALTH_DEPARTMENT_LARGE_SIZE_FILE_PRIVATE_KEY_PATH).then(
    fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'HealthDepartmentLargeFile.luca',
        mimeType: 'text/plain',
      });
    }
  );
};

export const uploadWrongHealthDepartmentPrivateKeyFile = () => {
  cy.get('.ant-modal').should('exist');
  cy.readFile(HEALTH_DEPARTMENT_WRONG_PRIVATE_KEY_PATH).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent,
      fileName: 'HealthDepartmentWrongKeyFile.luca',
      mimeType: 'text/plain',
    });
  });
};
export const removeHealthDepartmentPrivateKeyFile = () => {
  cy.task('deleteFileIfExists', HEALTH_DEPARTMENT_PRIVATE_KEY_PATH);
};

export const uploadWrongHealthDepartmentPrivateKeyFileType = () => {
  cy.get('.ant-modal').should('exist');
  cy.readFile(HEALTH_DEPARTMENT_WRONG_FILE_PRIVATE_KEY_PATH).then(
    fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'dummy.pdf',
        mimeType: 'application/pdf',
      });
    }
  );
};

export const uploadWrongHealthDepartmentPrivateKeyFileTypeReUploadCorrectFile = () => {
  cy.get('.ant-modal').should('exist');
  cy.readFile(HEALTH_DEPARTMENT_WRONG_PRIVATE_KEY_PATH).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent,
      fileName: 'HealthDepartmentWrongKeyFile.luca',
      mimeType: 'text/plain',
    });
  });
  cy.get('.ant-notification-notice', { timeout: 10000 }).should('be.visible');
  cy.get('.ant-modal').should('exist');

  cy.getByCy('tryAgain', { timeout: 1000 }).should('exist');
  cy.getByCy('tryAgain').click();
  cy.readFile(HEALTH_DEPARTMENT_PRIVATE_KEY_PATH).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent,
      fileName: 'HealthDepartmentKeyFile.luca',
      mimeType: 'text/plain',
    });
  });
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
