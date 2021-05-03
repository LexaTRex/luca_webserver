import { login } from '../../helpers/functions';
import { removeLocation } from '../location.helper';
import { E2E_PHONE_NUMBER } from '../../helpers/users';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  RESTAURANT_TYPE,
  NEW_RESTAURANT_LOCATION,
} from '../../helpers/locations';
import { checkRadiusInput } from '../../helpers/inputValidation.helper';

describe('Create restaurant location', () => {
  beforeEach(() => login());
  afterEach(() => removeLocation(NEW_RESTAURANT_LOCATION));
  describe('Without extra information', () => {
    it('generate location without tables and auto checkout', () => {
      cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      // Select type
      cy.getByCy(RESTAURANT_TYPE).click();
      // Enter name
      cy.get('#locationName').type(NEW_RESTAURANT_LOCATION);
      cy.getByCy('nextStep').click();
      // Same address
      cy.getByCy('yes').click();
      //Enter phone
      cy.get('#phone').type(E2E_PHONE_NUMBER);
      cy.getByCy('nextStep').click();
      // Select indoor
      cy.getByCy('indoorSelection').click();
      cy.getByCy('selectIndoor').click();
      cy.get('button[type=submit]').click();
      // Select tables
      cy.getByCy('no').click();
      // Select automatic checkout
      cy.getByCy('no').click();
      // Submit
      cy.getByCy('done').click();
      cy.getByCy('yes').click();
      cy.getByCy('done').click();
      cy.getByCy(`location-${NEW_RESTAURANT_LOCATION}`);
    });
  });
  describe('With tables', () => {
    it('with tables', () => {
      cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      cy.getByCy(RESTAURANT_TYPE).click();
      cy.get('#locationName').type(NEW_RESTAURANT_LOCATION);
      cy.getByCy('nextStep').click();
      cy.getByCy('yes').click();
      cy.get('#phone').type(E2E_PHONE_NUMBER);
      cy.getByCy('nextStep').click();
      // Select indoor
      cy.getByCy('indoorSelection').click();
      cy.getByCy('selectIndoor').click();
      cy.get('button[type=submit]').click();
      cy.getByCy('yes').click();
      cy.get('#tableCount').type('10');
      cy.getByCy('nextStep').click();
      cy.getByCy('no').click();
      cy.getByCy('done').click();
      cy.getByCy('yes').click();
      cy.getByCy('nextStep').click();
      cy.getByCy('done').click();
      cy.getByCy(`location-${NEW_RESTAURANT_LOCATION}`);
    });
  });

  describe('With auto checkout', () => {
    it('generate location with auto checkout', () => {
      cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      cy.getByCy(RESTAURANT_TYPE).click();
      cy.get('#locationName').type(NEW_RESTAURANT_LOCATION);
      cy.getByCy('nextStep').click();
      cy.getByCy('yes').click();
      cy.get('#phone').type(E2E_PHONE_NUMBER);
      cy.getByCy('nextStep').click();
      // Select indoor
      cy.getByCy('indoorSelection').click();
      cy.getByCy('selectIndoor').click();
      cy.get('button[type=submit]').click();
      cy.getByCy('no').click();
      cy.getByCy('yes').click();
      // Invalid radius input: empty, under 50 or over 5000
      checkRadiusInput();
      // Valid radius input
      cy.get('#radius').clear().type(100);
      cy.getByCy('nextStep').click();
      cy.getByCy('done').click();
      cy.getByCy('yes').click();
      cy.getByCy('done').click();
      cy.getByCy(`location-${NEW_RESTAURANT_LOCATION}`);
    });
  });
});
