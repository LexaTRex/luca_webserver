import { login } from '../../helpers/functions';
import { checkRadiusInput } from '../../helpers/inputValidation.helper';

const RESTAURANT_NAME = 'Test Restaurant';
const RESTAURANT_ADDRESS = 'Nexenio';
const RESTAURANT_PHONE = '0123456789';
const RESTAURANT_TABLE_COUNT = '12';
const RESTAURANT_RADIUS = '100';
describe('Group creation', () => {
  describe('Create Restaurant', () => {
    beforeEach(() => login());
    it('creates group of type restaurant', { retries: 3 }, () => {
      // Modal create group modal
      cy.getByCy('createGroup').should('exist');
      cy.getByCy('createGroup').click();
      // Select restaurant
      cy.getByCy('restaurant').click();
      // Enter name
      cy.get('#groupName').type(RESTAURANT_NAME);
      // Proceed
      cy.get('button[type=submit]').click();
      // Enter location
      cy.get('#locationSearch').type(RESTAURANT_ADDRESS);
      // Select from googleApi
      cy.get('.pac-container > div:first-of-type', { timeout: 4000 }).should(
        'be.visible'
      );
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
      cy.get('#phone').type(RESTAURANT_PHONE);
      // Proceed
      cy.get('button[type=submit]').click();
      // Select indoor
      cy.getByCy('indoorSelection').click();
      cy.getByCy('selectIndoor').click();
      cy.get('button[type=submit]').click();
      // Select tables
      cy.getByCy('yes').click();
      // Enter tables
      cy.get('#tableCount').type(RESTAURANT_TABLE_COUNT);
      // Proceed
      cy.get('button[type=submit]').click();
      // Select automatic checkout
      cy.getByCy('yes').click();
      // Enter radius
      checkRadiusInput();
      cy.get('#radius').clear().type(RESTAURANT_RADIUS);
      // Proceed
      cy.get('button[type=submit]').click();
      // Create group
      cy.getByCy('finishGroupCreation').click();
      // No qr download
      cy.getByCy('no').click();
      // Expect new group to be active
      cy.getByCy('groupName').should('exist');
      cy.getByCy('groupName').contains(RESTAURANT_NAME);
    });
  });
});
