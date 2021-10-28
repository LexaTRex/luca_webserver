import {
  E2E_HEALTH_DEPARTMENT_USERNAME,
  E2E_HEALTH_DEPARTMENT_PASSWORD,
} from '../../constants/user';
import { RESET_HD_KEYS_QUERY } from '../../constants/databaseQueries';
import { openHDLoginPage, verifyLoggedIn } from '../../helper/ui/login.helper';
import { HEALTH_DEPARTMENT_APP_ROUTE } from '../../constants/routes';
import { signHealthDepartment } from '../../helper/signHealthDepartment';
import { downloadHealthDepartmentPrivateKey } from '../../helper/ui/handlePrivateKeyFile';

describe('Authentication', () => {
  before(() => {
    cy.executeQuery(RESET_HD_KEYS_QUERY);
  });

  beforeEach(() => {
    openHDLoginPage();
  });

  describe('Health Department / Authentication / Login', () => {
    describe('when a user login for the first time with correct password', () => {
      it('ask to download private key and redirect to tracking page', () => {
        cy.basicLoginHD().then(response => {
          expect(response.status).to.eq(200);
        });
        cy.visit(HEALTH_DEPARTMENT_APP_ROUTE);
        signHealthDepartment();
        cy.url().should('include', '/app/tracking');
        cy.get('.ant-modal').within(() => {
          cy.contains('Setup').should('exist');
          cy.contains(
            'The key file for this health department was generated. Please make sure to download the file and not to lose it. You will need it to decrypt the data from requested locations.'
          ).should('exist');
          cy.getByCy('downloadPrivateKey').should('exist').should('be.enabled');
        });
        downloadHealthDepartmentPrivateKey();
        verifyLoggedIn();
      });
    });
    describe('when a user login with incorrect password', () => {
      it('error message is shown', () => {
        cy.basicLoginHD(E2E_HEALTH_DEPARTMENT_USERNAME, 'invalid').then(
          response => {
            expect(response.status).to.eq(401);
          }
        );
      });
    });
    describe('when an not existent user tries to login', () => {
      it('error message is shown', () => {
        cy.basicLoginHD(
          'invalid@nexenio.com',
          E2E_HEALTH_DEPARTMENT_PASSWORD
        ).then(response => {
          expect(response.status).to.eq(401);
        });
      });
    });
  });

  afterEach(() => cy.logoutHD());
});
