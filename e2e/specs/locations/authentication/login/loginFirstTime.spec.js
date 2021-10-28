import { shouldBeVisible, shouldNotExist, visit } from '../../utils/assertions';
import { getByCy, getDOMElement } from '../../utils/selectors';
import {
  LOGIN_ERROR_NOTIFICATION,
  FORGOT_PASSWORD_PAGE,
  FORGOT_PASSWORD_LINK,
} from '../../constants/selectorKeys';
import { WRONG_PASSWORD } from '../../constants/inputs';
import {
  E2E_EMAIL,
  E2E_LOCATION_PRIVATE_KEY_PATH,
  E2E_LOCATION_PRIVATE_KEY_NAME,
  E2E_LOCATION_WRONG_PRIVATE_KEY_PATH,
  E2E_LOCATION_WRONG_PRIVATE_KEY_NAME,
} from '../../constants/users';
import { RESET_LOCATION_KEY_QUERY } from '../../constants/databaseQueries';
import { enterEmail, enterPassword } from '../authentication.helper';
import { APP_ROUTE, BASE_ROUTE } from '../../constants/routes';
import {
  downloadLocationPrivateKeyFile,
  uploadLocationPrivateKeyFile,
} from '../../ui-helpers/handlePrivateKeyFile';

describe('Location / Authentication / Login', () => {
  before(() => {
    cy.executeQuery(RESET_LOCATION_KEY_QUERY);
  });
  afterEach(() => cy.logoutLocations());

  describe('Login as an operator for the first time and download a private key, after downloading the private key upload a wrong key and go back to download another key', () => {
    it('should show an error notification stating that the key is wrong to go back to regenerate a new download key', () => {
      cy.basicLoginLocations();
      visit(APP_ROUTE);
      downloadLocationPrivateKeyFile();
      uploadLocationPrivateKeyFile(
        E2E_LOCATION_WRONG_PRIVATE_KEY_PATH,
        E2E_LOCATION_WRONG_PRIVATE_KEY_NAME
      );
      shouldBeVisible(getByCy('regenerateKey', { timeout: 1000 })).click();
      downloadLocationPrivateKeyFile();
      shouldBeVisible(getDOMElement('.ant-notification-notice-content'));
    });
  });
  describe('Login as an operator for the first time and download private key, after downloading private double check if it is the correct key', () => {
    it('should close the modal successfully', () => {
      cy.basicLoginLocations();
      visit(APP_ROUTE);
      downloadLocationPrivateKeyFile();
      uploadLocationPrivateKeyFile(
        E2E_LOCATION_PRIVATE_KEY_PATH,
        E2E_LOCATION_PRIVATE_KEY_NAME
      );
      getByCy('complete', { timeout: 1000 }).click();
      shouldNotExist(getDOMElement('.ant-modal-body'));
    });
  });
  describe('Login as an operator with wrong password', () => {
    it('does not log in an existing user', () => {
      visit(BASE_ROUTE);
      enterEmail(E2E_EMAIL);
      enterPassword(WRONG_PASSWORD);
      shouldBeVisible(getByCy(LOGIN_ERROR_NOTIFICATION));
    });
  });
  describe('Forgot password', () => {
    it('redirects to forgot password page', () => {
      visit(BASE_ROUTE);
      enterEmail(E2E_EMAIL);
      enterPassword(WRONG_PASSWORD);
      shouldBeVisible(getByCy(LOGIN_ERROR_NOTIFICATION));
      shouldNotExist(getByCy(FORGOT_PASSWORD_PAGE));
      getByCy(FORGOT_PASSWORD_LINK).click();
      shouldBeVisible(getByCy(FORGOT_PASSWORD_PAGE));
    });
  });
});
