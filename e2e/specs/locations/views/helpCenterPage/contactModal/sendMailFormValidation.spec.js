/* eslint-disable */
import { loginLocations } from '../../../utils/auth';
import { HELP_CENTER_ROUTE } from '../../../constants/routes';
import {
  INVALID_PHONE_NUMBERS,
  INVALID_MESSAGES,
  VALID_PHONE_NUMBERS,
  VALID_MESSAGES,
} from '../../../constants/inputs';

describe('Send support mail modal validation', () => {
  before(() => loginLocations());
  beforeEach(() => {
    cy.basicLoginLocations();
    cy.visit(HELP_CENTER_ROUTE);
    cy.getByCy('helpCenterModalTrigger').click();
  });

  it('declines an invalid phone number and message', () => {
    INVALID_PHONE_NUMBERS.map(invalidNumber => {
      cy.getByCy('contactFormPhoneNumber').fill(invalidNumber);
      cy.get('.ant-form-item-explain-error').should('be.visible');
    });
    INVALID_MESSAGES.map(invalidMessage => {
      cy.getByCy('contactFormMessage').fill(invalidMessage);
      cy.get('.ant-form-item-explain-error').should('be.visible');
    });
  });

  it('declines an empty form submit', () => {
    cy.getByCy('contactFormSendButton').click();
    cy.get('.ant-form-item-explain-error').should('be.visible');
  });

  it('opens send mail success modal after valid input', () => {
    VALID_PHONE_NUMBERS.map(validNumber => {
      cy.getByCy('contactFormPhoneNumber').fill(validNumber);
      cy.get('.ant-form-item-explain-error').should('not.exist');
      VALID_MESSAGES.map(validMessage => {
        cy.getByCy('contactFormMessage').fill(validMessage);
        cy.get('.ant-form-item-explain-error').should('not.exist');
      });
    });
    cy.getByCy('contactFormSendButton').click();
    cy.getByCy('successNotificationModal').should('be.visible');
  });
});
