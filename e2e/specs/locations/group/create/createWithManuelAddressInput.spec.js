import { login } from '../../helpers/functions';

const HOTEL_PHONE = '0123456789';

const BASE_NAME = 'Test Group';
const BASE_AREA = 'Some area';

const STREET = 'Charlottenstr. ';
const STREET_NR = '59';
const ZIP = '10117';
const UNSUPPORTED_ZIP = '10111';
const STATE = 'Berlin';

describe('Group creation with manuell input', () => {
  beforeEach(() => login());
  it('creates group of type base', () => {
    // Modal create group modal
    cy.getByCy('createGroup').should('exist');
    cy.getByCy('createGroup').click();
    // Select base
    cy.getByCy('base').click();
    // Enter name
    cy.get('#groupName').type(BASE_NAME);
    // Proceed
    cy.get('button[type=submit]').click();
    // Select manuell search
    cy.getByCy('manuellSearch').click();
    // Wait for expand
    cy.wait(1000);
    // Expect fields to be not disabled
    cy.get('#streetName').should('exist');
    cy.get('#streetNr').should('exist');
    cy.get('#zipCode').should('exist');
    cy.get('#city').should('exist');
    cy.get('#streetName').should('not.be.disabled');
    cy.get('#streetNr').should('not.be.disabled');
    cy.get('#zipCode').should('not.be.disabled');
    cy.get('#city').should('not.be.disabled');
    // Type address
    cy.get('#streetName').type(STREET);
    cy.get('#streetNr').type(STREET_NR);
    cy.get('#zipCode').type(ZIP);
    cy.get('#city').type(STATE);
    // Proceed
    cy.getByCy('proceed').click();
    // Enter phone
    cy.get('#phone').type(HOTEL_PHONE);
    // Proceed
    cy.get('button[type=submit]').click();
    // Select more areas
    cy.getByCy('yes').click();
    cy.get('input').type(BASE_AREA);
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
