import { checkRadiusInput } from './validations';

export const openCreateLocationModal = group => {
  // Modal create location modal
  cy.getByCy(`createLocation-${group}`).click();
};

export const selectLocationType = type => {
  cy.getByCy(type).click();
};

export const setLocationName = name => {
  cy.get('#locationName').type(name);
  cy.getByCy('nextStep').click();
};

export const setLocationPhone = phone => {
  cy.get('#phone').type(phone);
  cy.getByCy('nextStep').click();
};

export const setLocationIndoorSelection = () => {
  // Select indoor
  cy.getByCy('indoorSelection').click();
  cy.getByCy('selectIndoor').click();
  cy.get('button[type=submit]').click();
};

export const setLocationTableCount = count => {
  cy.get('#tableCount').type(count);
  cy.getByCy('nextStep').click();
};

export const setLocationRadius = radius => {
  // Invalid radius input: empty, under 50 or over 5000
  checkRadiusInput();
  // Valid radius input
  cy.get('#radius').clear().type(radius);
  cy.getByCy('nextStep').click();
};
