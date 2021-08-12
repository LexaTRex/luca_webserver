import { HEALTH_DEPARTMENT_PRIVATE_KEY_PATH } from '../user';
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

export const loginToHD = (email, password) => {
  cy.get('#username').type(email);
  cy.get('#password').click();
  cy.get('#password').type(password);
  cy.get('button[type=submit]').click();
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

export const removeHealthDepartmentPrivateKeyFile = () => {
  cy.task('deleteFileIfExists', HEALTH_DEPARTMENT_PRIVATE_KEY_PATH);
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
