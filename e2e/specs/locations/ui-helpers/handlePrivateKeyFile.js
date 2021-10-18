import {
  E2E_LOCATION_PRIVATE_KEY_NAME,
  E2E_LOCATION_PRIVATE_KEY_PATH,
} from '../constants/users';

export const downloadLocationPrivateKeyFile = () => {
  cy.getByCy('downloadPrivateKey').click();
  cy.getByCy('checkPrivateKeyIsDownloaded').click();
  cy.getByCy('next').should('exist').click();
};
export const uploadLocationPrivateKeyFile = (filename, name) => {
  cy.readFile(filename).then(fileContent => {
    cy.get('input[type=file]', { timeout: 10000 }).attachFile({
      fileContent,
      mimeType: 'text/plain',
      fileName: name,
    });
  });
};
export const skipLocationPrivateKeyFile = () => {
  cy.get('.ant-modal-content').within($modal => {
    cy.getByCy('skipPrivateKeyUpload')
      .should('exist')
      .should('be.visible')
      .click();
  });
};

export const addLocationPrivateKeyFile = (
  filename = E2E_LOCATION_PRIVATE_KEY_PATH,
  name = E2E_LOCATION_PRIVATE_KEY_NAME
) => {
  cy.task('fileExists', filename).then(exists => {
    if (!exists) {
      cy.log('Private key should be downloaded');
      downloadLocationPrivateKeyFile();
    } else {
      uploadLocationPrivateKeyFile(filename, name);
    }
  });
};
