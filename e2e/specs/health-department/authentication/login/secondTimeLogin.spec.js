import {
  E2E_HEALTH_DEPARTMENT_USERNAME,
  E2E_HEALTH_DEPARTMENT_PASSWORD,
} from '../../helper/user';
import { logout } from '../../helper/api/auth.helper';
import {
  loginToHD,
  openHDLoginPage,
  addHealthDepartmentPrivateKeyFile,
} from '../../helper/ui/login.helper';

describe('Autentication', () => {
  describe('Health Department / Authentication / Login', () => {
    describe('when a user login for the second time', () => {
      it('ask to upload private key and redirect to tracking page', () => {
        openHDLoginPage();
        loginToHD(
          E2E_HEALTH_DEPARTMENT_USERNAME,
          E2E_HEALTH_DEPARTMENT_PASSWORD
        );
        cy.contains('Wrong Email or password').should('not.exist');
        cy.url().should('include', '/app/tracking');
        addHealthDepartmentPrivateKeyFile();
        cy.getByCy('header')
          .contains('Health-Department')
          .should('exist')
          .should('be.visible');
        cy.getByCy('linkMenu').should('exist').should('be.visible');
        cy.get('button').contains('LOG OUT').should('exist');

        cy.get('.ant-menu-horizontal').should('exist').should('be.visible');
        cy.getByCy('navigation').should('exist').should('be.visible');
        logout();
      });
    });
  });
});
