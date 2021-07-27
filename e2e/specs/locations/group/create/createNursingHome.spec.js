import { login } from '../../helpers/functions';
import { checkRadiusInput } from '../../helpers/inputValidation.helper';

const NURSING_HOME_NAME = 'Test Nursing Home';
const NURSING_HOME_ADDRESS = 'Nexenio';
const NURSING_HOME_PHONE = '+4917612345678';
const NURSING_HOME_RADIUS = '100';
describe('Group creation', () => {
  beforeEach(() => login());
  describe('Create Nursing Home', () => {
    it('creates group of type nursing_home', { retries: 3 }, () => {
      // Modal create group modal
      cy.getByCy('createGroup').should('exist');
      cy.getByCy('createGroup').click();
      // Select nursing home
      cy.getByCy('nursing_home').click();
      // Enter name
      cy.get('#groupName').type(NURSING_HOME_NAME);
      // Proceed
      cy.get('button[type=submit]').click();
      // Enter location
      cy.get('#locationSearch').type(NURSING_HOME_ADDRESS);
      // Select from googleApi
      cy.get('.pac-container > div:first-of-type').should('be.visible');
      cy.get('.pac-container > div:first-of-type').click();
      // Expect fields to be filled out and disabled
      cy.get('#streetName').should('exist');
      cy.get('#streetNr').should('exist');
      cy.get('#zipCode').should('exist');
      cy.get('#city').should('exist');
      cy.get('#streetName').should('be.disabled');
      cy.get('#streetNr').should('be.disabled');
      cy.get('#zipCode').should('be.disabled');
      cy.get('#city').should('be.disabled');
      // Proceed
      cy.getByCy('proceed').click();
      // Enter phone
      cy.get('#phone').type(NURSING_HOME_PHONE);
      // Proceed
      cy.get('button[type=submit]').click();
      // Select post checkin questions
      cy.getByCy('yes').click();
      // Select automatic checkout
      cy.getByCy('yes').click();
      // Enter radius
      checkRadiusInput();
      cy.get('#radius').clear().type(NURSING_HOME_RADIUS);
      // Proceed
      cy.get('button[type=submit]').click();
      // Create group
      cy.getByCy('finishGroupCreation').click();
      // No qr download
      cy.getByCy('no').click();
      // Expect new group to be active
      cy.getByCy('groupName').should('exist');
      cy.getByCy('groupName').contains(NURSING_HOME_NAME);
    });
  });
});
