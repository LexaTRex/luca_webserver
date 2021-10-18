import { checkRadiusInput } from './validations';

export const addressFields = ['#streetName', '#streetNr', '#zipCode', '#city'];

export const openCreateGroupModal = () => {
  // Modal create group modal
  cy.getByCy('createGroup').should('exist');
  cy.getByCy('createGroup').click();
};

export const selectGroupType = type => {
  // Select hotel
  cy.getByCy(type).click();
};

export const setGroupName = name => {
  // Enter name
  cy.get('#groupName').type(name);
  // Proceed
  cy.get('button[type=submit]').click();
};

export const setGroupAddress = address => {
  // Accept Google API
  cy.getByCy('yes').click();
  // Enter location
  cy.get('#locationSearch').type(address);
  // Select from googleApi
  cy.get('.pac-container > div:first-of-type', { timeout: 10000 }).should(
    'be.visible'
  );
  cy.get('.pac-container > div:first-of-type').click();
};

export const setGroupTables = tableCount => {
  // Select tables
  cy.getByCy('yes').click();
  // Enter tables
  cy.get('#tableCount').type(tableCount);
  // Proceed
  cy.get('button[type=submit]').click();
};

export const checkForExistingFields = fields =>
  fields.map(field => cy.get(field).should('exist'));

export const checkForDisabledFields = fields =>
  fields.map(field => cy.get(field).should('be.disabled'));

export const checkForNonDisabledFields = fields =>
  fields.map(field => cy.get(field).should('not.be.disabled'));

export const setGroupPhone = number => {
  // Enter phone
  cy.get('#phone').type(number);
  // Proceed
  cy.get('button[type=submit]').click();
};

export const setGroupIndoorSelection = () => {
  // Select indoor
  cy.getByCy('indoorSelection').click();
  cy.getByCy('selectIndoor').click();
  // Proceed
  cy.get('button[type=submit]').click();
};

export const setGroupArea = areaName => {
  // Select more areas
  cy.getByCy('yes').click();
  cy.getByCy('areaNameInput').type(areaName);
  setGroupIndoorSelection();
};

export const setGroupRadius = radius => {
  // Select automatic checkout
  cy.getByCy('yes').click();
  // Enter radius
  checkRadiusInput();
  cy.get('#radius').clear().type(radius);
  // Proceed
  cy.get('button[type=submit]').click();
};

export const setGroupManualAddress = (street, streetNr, zip, state) => {
  // Type address
  cy.get('#streetName').type(street);
  cy.get('#streetNr').type(streetNr);
  cy.get('#zipCode').type(zip);
  cy.get('#city').type(state);
  // Proceed
  cy.getByCy('proceed').click();
};
