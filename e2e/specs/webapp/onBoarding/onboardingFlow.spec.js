import { WEBAPP_ROUTE } from '../helpers/routes';
import {
  WEBAPP_FIRSTNAME,
  WEBAPP_LASTNAME,
  WEBAPP_EMAIL,
  WEBAPP_PHONE_NUMBER,
  WEBAPP_STREET,
  WEBAPP_HOUSE_NO,
  WEBAPP_ZIP,
  WEBAPP_CITY,
} from '../helpers/users';

describe('Webapp onboarding', () => {
  beforeEach(() => cy.visit(WEBAPP_ROUTE));
  it('can register a visitor', () => {
    // Welcome step
    cy.getByCy('ignoreWarning').click();
    cy.getByCy('welcomeStep').should('exist');
    cy.getByCy('termsConsCheckbox').click();
    cy.getByCy('privacyCheckbox').click();
    cy.getByCy('welcomeSubmit').click();
    // Privacy step
    cy.getByCy('dataContent').should('exist');
    cy.getByCy('dataSubmit').click();
    // Name input step
    cy.getByCy('nameInput').should('exist');
    cy.get('#firstName').type(WEBAPP_FIRSTNAME);
    cy.get('#lastName').type(WEBAPP_LASTNAME);
    cy.getByCy('nameInputSubmit').click();
    // Contact info step
    cy.getByCy('contactInfo').should('exist');
    cy.get('#email').type(WEBAPP_EMAIL);
    cy.get('#phoneNumber').type(WEBAPP_PHONE_NUMBER);
    cy.getByCy('contactInfoSubmit').click();
    // tan:
    cy.get('#tan').type('123{enter}');
    // Location input step
    cy.getByCy('locationInput').should('exist');
    cy.get('#street').type(WEBAPP_STREET);
    cy.get('#houseNumber').type(WEBAPP_HOUSE_NO);
    cy.get('#zip').type(WEBAPP_ZIP);
    cy.get('#city').type(WEBAPP_CITY);
    cy.getByCy('locationInputSubmit').click();
    // Finish step
    cy.getByCy('finishStep').should('exist');
    cy.getByCy('finishStepSubmit').click();
    // QR Code
    cy.getByCy('QRCodeInfo').should('exist');
  });
});
