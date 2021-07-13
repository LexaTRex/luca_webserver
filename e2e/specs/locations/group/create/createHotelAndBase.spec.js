import { login } from '../../helpers/functions';
import { checkRadiusInput } from '../../helpers/inputValidation.helper';

const HOTEL_NAME = 'Test Hotel';
const HOTEL_ADDRESS = 'Nexenio';
const HOTEL_PHONE = '017612345678';
const HOTEL_AREA = 'Restaurant';
const HOTEL_RADIUS = '100';

const BASE_NAME = 'Test Group';
const BASE_AREA = 'Some area';

describe('Group creation', () => {
  beforeEach(() => login());
  describe('Create hotel or base type', () => {
    it('creates group of type hotel', { retries: 3 }, () => {
      // Modal create group modal
      cy.getByCy('createGroup').should('exist');
      cy.getByCy('createGroup').click();
      // Select hotel
      cy.getByCy('hotel').click();
      // Enter name
      cy.get('#groupName').type(HOTEL_NAME);
      // Proceed
      cy.get('button[type=submit]').click();
      // Enter location
      cy.get('#locationSearch').type(HOTEL_ADDRESS);
      // Select from googleApi
      cy.get('.pac-container > div:first-of-type', { timeout: 2000 }).should(
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
      cy.get('#phone').type(HOTEL_PHONE);
      // Proceed
      cy.get('button[type=submit]').click();
      // Select more areas
      cy.getByCy('yes').click();
      cy.getByCy('areaNameInput').type(HOTEL_AREA);
      cy.getByCy('indoorSelection').click();
      cy.getByCy('selectIndoor').click();
      // Proceed
      cy.get('button[type=submit]').click();
      // Select automatic checkout
      cy.getByCy('yes').click();
      // Enter radius
      checkRadiusInput();
      cy.get('#radius').clear().type(HOTEL_RADIUS);
      // Proceed
      cy.get('button[type=submit]').click();
      // Create group
      cy.getByCy('finishGroupCreation').click();
      // No qr download
      cy.getByCy('no').click();
      // Expect new group to be active
      cy.getByCy('groupName').should('exist');
      cy.getByCy('groupName').contains(HOTEL_NAME);
      // Expect hotel area to be in the list
      cy.contains('#groupList', HOTEL_AREA);
    });
    it('creates group of type base', { retries: 3 }, () => {
      // Modal create group modal
      cy.getByCy('createGroup').should('exist');
      cy.getByCy('createGroup').click();
      // Select base
      cy.getByCy('base').click();
      // Enter name
      cy.get('#groupName').type(BASE_NAME);
      // Proceed
      cy.get('button[type=submit]').click();
      // Enter location
      cy.get('#locationSearch').type(HOTEL_ADDRESS);
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
      cy.get('#phone').type(HOTEL_PHONE);
      // Proceed
      cy.get('button[type=submit]').click();
      // Select more areas
      cy.getByCy('yes').click();
      cy.getByCy('areaNameInput').type(BASE_AREA);
      cy.getByCy('indoorSelection').click();
      cy.getByCy('selectIndoor').click();
      // Proceed
      cy.get('button[type=submit]').click();
      // Select automatic checkout
      cy.getByCy('yes').click();
      // Enter radius
      checkRadiusInput();
      cy.get('#radius').clear().type(HOTEL_RADIUS);
      // Proceed
      cy.get('button[type=submit]').click();
      // Create group
      cy.getByCy('finishGroupCreation').click();
      // No qr download
      cy.getByCy('no').click();
      // Expect new group to be active
      cy.getByCy('groupName').should('exist');
      cy.getByCy('groupName').contains(BASE_NAME);
      // Expect hotel area to be in the list
      cy.contains('#groupList', BASE_AREA);
    });
  });
});
