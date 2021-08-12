import { uploadLocationPrivateKeyFile } from '../../helpers/functions';
import {
  E2E_EMAIL,
  E2E_PASSWORD,
  E2E_LOCATION_PRIVATE_KEY_PATH,
  E2E_LOCATION_PRIVATE_KEY_NAME,
} from '../../helpers/users';
import { enterEmail, enterPassword } from '../authentication.helper';
import {
  verifyLocationHomePage,
  verifyModalWindowIsClosed,
} from '../../helpers/inputValidation.helper';

describe('Location / Authentication / Login', () => {
  describe('Login as an operator and upload private key', () => {
    it('accepts private key and displays location home page', () => {
      cy.visit('/');
      enterEmail(E2E_EMAIL);
      enterPassword(E2E_PASSWORD);
      cy.getByCy('loginError').should('not.exist');
      uploadLocationPrivateKeyFile(
        E2E_LOCATION_PRIVATE_KEY_PATH,
        E2E_LOCATION_PRIVATE_KEY_NAME
      );
      verifyModalWindowIsClosed();
      verifyLocationHomePage();
    });
  });
});
