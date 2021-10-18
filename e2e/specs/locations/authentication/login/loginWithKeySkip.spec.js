import {
  verifyLocationHomePage,
  verifyModalWindowIsClosed,
} from '../../ui-helpers/validations';
import { APP_ROUTE } from '../../constants/routes';
import { skipLocationPrivateKeyFile } from '../../ui-helpers/handlePrivateKeyFile';

describe('Location / Authentication / Login', () => {
  describe('Login as an operator and provide private key later', () => {
    it('displays location home page', () => {
      cy.basicLoginLocations().then(response => {
        expect(response.status).to.eq(200);
      });
      cy.visit(APP_ROUTE, {
        onBeforeLoad: win => {
          win.sessionStorage.clear();
        },
      });
      skipLocationPrivateKeyFile();
      verifyModalWindowIsClosed();
      verifyLocationHomePage();
    });
  });
});
