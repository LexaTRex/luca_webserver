import {
  E2E_HEALTH_DEPARTMENT_USERNAME,
  E2E_HEALTH_DEPARTMENT_PASSWORD,
} from '../../helper/user';
import { logout } from '../../helper/api/auth.helper';
import { RESET_HD_KEYS_QUERY } from '../../helper/dbQueries';
import {
  loginToHD,
  openHDLoginPage,
  downloadHealthDepartmentPrivateKey,
} from '../../helper/ui/login.helper';

describe('Autentication', () => {
  before(() => {
    cy.executeQuery(RESET_HD_KEYS_QUERY);
  });

  beforeEach(() => {
    openHDLoginPage();
  });

  describe('Health Department / Authentication / Login', () => {
    describe('when a user login for the first time with correct password', () => {
      it('ask to download private key and redirect to tracking page', () => {
        loginToHD(
          E2E_HEALTH_DEPARTMENT_USERNAME,
          E2E_HEALTH_DEPARTMENT_PASSWORD
        );
        cy.contains('Wrong Email or password').should('not.exist');
        cy.url().should('include', '/app/tracking');
        cy.get('.ant-modal').within(() => {
          cy.contains('Setup').should('exist');
          cy.contains(
            'The key file for this health department was generated. Please make sure to download the file and not to lose it. You will need it to decrypt the data from requested locations.'
          ).should('exist');
          cy.getByCy('downloadPrivateKey').should('exist').should('be.enabled');
        });
        downloadHealthDepartmentPrivateKey();
        cy.getByCy('header')
          .contains('Health-Department')
          .should('exist')
          .should('be.visible');
        cy.getByCy('linkMenu').should('exist').should('be.visible');
        cy.get('button').contains('LOG OUT').should('exist');

        cy.get('.ant-menu-horizontal').should('exist').should('be.visible');
        cy.getByCy('navigation').should('exist').should('be.visible');
      });
    });
    describe('when a user login with incorrect password', () => {
      it('error message is shown', () => {
        loginToHD(E2E_HEALTH_DEPARTMENT_USERNAME, 'invalid');
        cy.contains('Wrong Email or password').should('exist');
      });
    });
    describe('when an not existent user tries to login', () => {
      it('error message is shown', () => {
        loginToHD('invalid', E2E_HEALTH_DEPARTMENT_PASSWORD);
        cy.contains('Wrong Email or password').should('exist');
      });
    });
  });

  afterEach(() => logout());
});
