import { login } from '../../helpers/functions';
import { removeLocation } from '../location.helper';
import { E2E_PHONE_NUMBER } from '../../helpers/users';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  NEW_BASE_LOCATION,
  BASE_TYPE,
} from '../../helpers/locations';
import {
  checkRadiusInput,
  defaultLocationNameShouldBeRejected,
  checkLocationNameIsUnique,
} from '../../helpers/inputValidation.helper';

context('Create base location', () => {
  describe('Location name validation', () => {
    beforeEach(() => login());
    it('checks if the location name is the default name', () => {
      cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      cy.getByCy(BASE_TYPE).click();
      defaultLocationNameShouldBeRejected();
    });
    it('checks if the location name is unique', () => {
      cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      cy.getByCy(BASE_TYPE).click();
      checkLocationNameIsUnique();
    });
  });

  describe('Create a base location', () => {
    beforeEach(() => login());
    afterEach(() => removeLocation(NEW_BASE_LOCATION));
    describe('Without extra information', () => {
      it('generate location without auto checkout', () => {
        cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
        cy.getByCy(BASE_TYPE).click();
        cy.get('#locationName').type(NEW_BASE_LOCATION);
        cy.getByCy('nextStep').click();
        cy.getByCy('yes').click();
        cy.get('#phone').type(E2E_PHONE_NUMBER);
        cy.getByCy('nextStep').click();
        // Select indoor
        cy.getByCy('indoorSelection').click();
        cy.getByCy('selectIndoor').click();
        cy.get('button[type=submit]').click();
        cy.getByCy('no').click();
        cy.getByCy('done').click();
        cy.getByCy('yes').click();
        cy.getByCy('done').click();
        cy.getByCy(`location-${NEW_BASE_LOCATION}`);
      });
    });

    describe('With auto checkout', () => {
      it('generate new location', () => {
        cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
        cy.getByCy(BASE_TYPE).click();
        cy.get('#locationName').type(NEW_BASE_LOCATION);
        cy.getByCy('nextStep').click();
        cy.getByCy('yes').click();
        cy.get('#phone').type(E2E_PHONE_NUMBER);
        cy.getByCy('nextStep').click();
        // Select indoor
        cy.getByCy('indoorSelection').click();
        cy.getByCy('selectIndoor').click();
        cy.get('button[type=submit]').click();
        cy.getByCy('yes').click();
        // Invalid radius input: empty, under 50 or over 5000
        checkRadiusInput();
        // Valid radius input
        cy.get('#radius').clear().type(100);
        cy.getByCy('nextStep').click();
        cy.getByCy('done').click();
        cy.getByCy('yes').click();
        cy.getByCy('done').click();
        cy.getByCy(`location-${NEW_BASE_LOCATION}`);
      });
    });
  });
});
