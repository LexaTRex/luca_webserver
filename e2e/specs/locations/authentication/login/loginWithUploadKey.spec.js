import { loginLocations } from '../../utils/auth';
import {
  E2E_EMAIL,
  E2E_PASSWORD,
  E2E_LOCATION_PRIVATE_KEY_PATH,
  E2E_LOCATION_PRIVATE_KEY_NAME,
} from '../../constants/users';
import {
  verifyLocationHomePage,
  verifyModalWindowIsClosed,
} from '../../ui-helpers/validations';
import { uploadLocationPrivateKeyFile } from '../../ui-helpers/handlePrivateKeyFile';
import { APP_ROUTE } from '../../constants/routes';

describe('Location / Authentication / Login', () => {
  describe('Login as an operator and upload private key', () => {
    it('accepts private key and displays location home page', () => {
      cy.basicLoginLocations().then(response => {
        expect(response.status).to.eq(200);
      });
      cy.visit(APP_ROUTE, {
        onBeforeLoad: win => {
          win.sessionStorage.clear();
        },
      });
      uploadLocationPrivateKeyFile(
        E2E_LOCATION_PRIVATE_KEY_PATH,
        E2E_LOCATION_PRIVATE_KEY_NAME
      );
      verifyModalWindowIsClosed();
      verifyLocationHomePage();
    });
  });
});
