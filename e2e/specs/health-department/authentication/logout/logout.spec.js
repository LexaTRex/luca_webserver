import { loginHealthDepartment } from '../../helper/api/auth.helper';
import { addHealthDepartmentPrivateKeyFile } from '../../helper/ui/login.helper';

describe('Health Department / Authentication / Logout', () => {
  beforeEach(() => {
    loginHealthDepartment();
    addHealthDepartmentPrivateKeyFile();
  });
  describe('when an operator logs out', () => {
    it('redirect to Login page', () => {
      cy.getByCy('logout').should('exist').should('be.visible').click();
      cy.get('form.ant-form').within(($form) => {
        cy.get('#username').should('exist').should('be.visible');
        cy.get('#password').should('exist').should('be.visible');
        cy.get('button[type=submit]').should('exist').should('be.visible');
      });
    });
  });
});
