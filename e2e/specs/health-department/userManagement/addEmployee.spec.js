import { loginToHD, openHDLoginPage } from '../helper/ui/login.helper';
import { loginHealthDepartment, logout } from '../helper/api/auth.helper';
import {
  HEALTH_DEPARTMENT_TRACKING_ROUTE,
  HEALTH_DEPARTMENT_USER_MANAGEMENT_ROUTE,
} from '../helper/routes';

const EMPLOYEE_FIRST_NAME = 'Luca';
const EMPLOYEE_LAST_NAME = 'Tester';
const EMPLOYEE_EMAIL = 'employee@hd.com';
const EMPLOYEE_PHONE = '+49 176 12345678';

describe('Health Department / User Management / Create new employee', () => {
  describe('when create a new HD employee', () => {
    it('the employee is created and able to login', () => {
      loginHealthDepartment();
      cy.visit(HEALTH_DEPARTMENT_USER_MANAGEMENT_ROUTE);
      cy.getByCy('addEmployee').should('exist').should('be.visible').click();
      //fillin employee form
      cy.get('.ant-modal').within($modal => {
        cy.get('#firstName')
          .should('exist')
          .should('be.visible')
          .type(EMPLOYEE_FIRST_NAME);
        cy.get('#lastName')
          .should('exist')
          .should('be.visible')
          .type(EMPLOYEE_LAST_NAME);
        cy.get('#phone')
          .should('exist')
          .should('be.visible')
          .type(EMPLOYEE_PHONE);
        cy.get('#email')
          .should('exist')
          .should('be.visible')
          .type(EMPLOYEE_EMAIL);
        cy.get('button[type=button]').should('exist').should('be.visible');
        cy.get('button[type=submit]')
          .should('exist')
          .should('be.visible')
          .click();
      });
      //save generated password
      cy.get('.ant-notification').should('exist').should('be.visible');
      cy.get('.ant-modal').within($modal => {
        cy.getByCy('generatedPassword').then($password => {
          cy.wrap($password.text()).as('password');
        });
        cy.get('button[type=button]')
          .should('exist')
          .should('be.visible')
          .click();
      });
      cy.get('.ant-popconfirm').within($popup => {
        cy.get('.ant-popover-buttons > button:nth-child(1)')
          .should('exist')
          .should('be.visible');
        cy.get('.ant-popover-buttons > .ant-btn-primary')
          .should('exist')
          .should('be.visible')
          .click();
      });
      //verify employee is created
      cy.get('#employeeTable > div')
        .last()
        .then($row => {
          expect($row.text()).contains(
            EMPLOYEE_FIRST_NAME + ' ' + EMPLOYEE_LAST_NAME
          );
          expect($row.text()).contains(EMPLOYEE_PHONE);
          expect($row.text()).contains(EMPLOYEE_EMAIL);
        });
      logout();
      //login as a new employee
      openHDLoginPage();
      cy.get('@password').then(password => {
        loginToHD(EMPLOYEE_EMAIL, password);
      });
      cy.url().should('include', HEALTH_DEPARTMENT_TRACKING_ROUTE);
    });
  });
});
