/* eslint-disable */
import {
  E2E_EMAIL,
  E2E_FIRSTNAME,
  E2E_LASTNAME,
  E2E_PASSWORD,
} from '../../constants/users';
import { enterEmail } from '../authentication.helper';

const INACTIVE_EMAIL = `inactive-user-${Date.now()}@nexenio.com`;
const NONEXISTENT_EMAIL = 'non-existant-user@nexenio.com';

describe('Forgot password', () => {
  beforeEach(() => cy.visit('/'));

  it('can send the reset password email and redirect the user back to the login page', () => {
    enterEmail(E2E_EMAIL);
    cy.get('#password').should('exist');
    cy.getByCy('forgotPasswordLink').click();
    cy.getByCy('forgotPasswordPage').should('exist');
    enterEmail(E2E_EMAIL);
    cy.getByCy('sentResetLinkSubmit').click();
    cy.get('.ant-notification-notice-message').should('exist');
    cy.getByCy('loginPage').should('exist');
    cy.get('#email').should('exist');
  });

  it('displays the notification that the account is not activated', () => {
    // Register new user
    cy.visit('/register');
    enterEmail(INACTIVE_EMAIL);
    cy.get('button').click();
    cy.getByCy('confirmRegister').should('exist');
    cy.get('#emailDisabled').should('exist');
    cy.get('#emailDisabled').should('have.value', INACTIVE_EMAIL);
    cy.get('button[type=submit]').should('exist').click();

    // Enter new user details
    cy.get('#firstName').should('exist').type(E2E_FIRSTNAME);
    cy.get('#lastName').should('exist').type(E2E_LASTNAME);
    cy.get('button[type=submit]').should('exist').click();

    // Enter new user password
    cy.getByCy('setPassword').should('exist');
    cy.get('#password').should('exist').type(E2E_PASSWORD);
    cy.get('#passwordConfirm').should('exist').type(E2E_PASSWORD);
    cy.get('button[type=submit]').should('exist').click();

    // Accept conditions
    cy.getByCy('legalTerms').should('exist');
    cy.get('#termsAndConditions').should('exist').click();
    cy.get('#avv').should('exist').click();
    cy.get('button[type=submit]').should('exist').click();

    // Finish registration
    cy.getByCy('finishRegister').should('exist');
    cy.get('button[type=button]').should('exist').click();

    // Return to login form
    cy.visit('/');
    cy.getByCy('loginPage').should('exist');
    enterEmail(INACTIVE_EMAIL);
    cy.getByCy('forgotPasswordLink').should('exist').click();
    enterEmail(INACTIVE_EMAIL);
    // Send reset link
    cy.getByCy('sentResetLinkSubmit').should('exist').click();

    // Notification;
    cy.get('.ant-notification-notice-icon-warning').should('exist');
  });

  it('displays the notification that the account does not exist ', () => {
    // Send reset link
    cy.visit('/forgotPassword');
    enterEmail(NONEXISTENT_EMAIL);
    cy.get('button').click();
    // Notification;
    cy.get('.ant-notification-notice-icon-warning').should('exist');
  });
});
