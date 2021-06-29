import {
  HEALTH_DEPARTMENT_APP_ROUTE,
  HEALTH_DEPARTMENT_BASE_ROUTE,
} from './routes';
import {
  E2E_HEALTH_DEPARTMENT_USERNAME,
  E2E_HEALTH_DEPARTMENT_PASSWORD,
} from './user';
import path from 'path';

export const loginHealthDepartment = () => {
  cy.request({
    method: 'POST',
    url: 'api/v3/auth/healthDepartmentEmployee/login',
    body: {
      username: E2E_HEALTH_DEPARTMENT_USERNAME,
      password: E2E_HEALTH_DEPARTMENT_PASSWORD,
    },
    headers: {
      host: 'localhost',
      origin: 'https://localhost',
    },
  });

  cy.visit(HEALTH_DEPARTMENT_APP_ROUTE);
};

export const logout = () => {
  cy.request({
    method: 'POST',
    url: 'api/v3/auth/logout',
    headers: {
      host: 'localhost',
      origin: 'https://localhost',
    },
  });

  cy.visit(HEALTH_DEPARTMENT_BASE_ROUTE);
};

const deleteHealthDepartmentPrivateKey = () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  const keyPath = path.join(downloadsFolder, 'HealthDepartmentKeyFile.luca');
  cy.task('deleteFileIfExists', keyPath);
};

export const downloadHealthDepartmentPrivateKey = () => {
  deleteHealthDepartmentPrivateKey();
  cy.get('.ant-modal').should('exist');
  cy.getByCy('downloadPrivateKey', { timeout: 8000 }).click();
  cy.getByCy('next').should('exist');
  cy.getByCy('next').click();
  cy.getByCy('finish').should('exist');
  cy.getByCy('finish').click();
};

export const uploadHealthDepartmentPrivateKeyFile = () => {
  cy.get('.ant-modal').should('exist');
  const downloadsFolder = Cypress.config('downloadsFolder');
  const fileName = 'HealthDepartmentKeyFile.luca';
  cy.readFile(path.join(downloadsFolder, fileName)).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent,
      fileName,
      mimeType: 'text/plain',
    });
  });
};
