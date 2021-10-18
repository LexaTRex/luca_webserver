import { loginHealthDepartment } from '../../helper/api/auth.helper';
import { addHealthDepartmentPrivateKeyFile } from '../../helper/ui/login.helper';

describe('Autentication', () => {
  describe('Health Department / Authentication / Login', () => {
    describe('when a user login for the second time', () => {
      it('ask to upload private key and redirect to tracking page', () => {
        loginHealthDepartment();
        addHealthDepartmentPrivateKeyFile();
        cy.getByCy('header')
          .contains('Health-Department')
          .should('exist')
          .should('be.visible');
        cy.getByCy('linkMenu').should('exist').should('be.visible');
        cy.get('button').contains('LOG OUT').should('exist');

        cy.get('.ant-menu-horizontal').should('exist').should('be.visible');
        cy.getByCy('navigation').should('exist').should('be.visible');
        cy.logoutHD();
      });
    });
  });
});
