import { skipLocationPrivateKeyFile } from '../../helpers/functions';
import { E2E_EMAIL, E2E_PASSWORD } from '../../helpers/users';
import { enterEmail, enterPassword } from '../authentication.helper';
import {
  verifyLocationHomePage,
  verifyModalWindowIsClosed,
} from '../../helpers/inputValidation.helper';

describe('Location / Authentication / Login', () => {
  describe('Login as an operator and provide private key later', () => {
    it('displays location home page', () => {
      cy.visit('/');
      enterEmail(E2E_EMAIL);
      enterPassword(E2E_PASSWORD);
      cy.getByCy('loginError').should('not.exist');
      skipLocationPrivateKeyFile();
      verifyModalWindowIsClosed();
      verifyLocationHomePage();
    });
  });
});
