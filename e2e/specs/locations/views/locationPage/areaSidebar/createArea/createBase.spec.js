import { loginLocations } from '../../../../utils/auth';
import { E2E_PHONE_NUMBER } from '../../../../constants/users';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  NEW_BASE_LOCATION,
  BASE_TYPE,
} from '../../../../constants/locations';
import {
  defaultLocationNameShouldBeRejected,
  checkLocationNameIsUnique,
} from '../../../../ui-helpers/validations';
import {
  openCreateLocationModal,
  selectLocationType,
  setLocationName,
  setLocationPhone,
  setLocationIndoorSelection,
  setLocationRadius,
} from '../../../../ui-helpers/createLocation';
import { removeLocation } from '../../../../utils/locations';

context('Create base location', () => {
  describe('Location name validation', () => {
    beforeEach(() => loginLocations());
    it('checks if the location name is the default name', () => {
      openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
      selectLocationType(BASE_TYPE);
      defaultLocationNameShouldBeRejected();
    });
    it('checks if the location name is unique', () => {
      openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
      selectLocationType(BASE_TYPE);
      checkLocationNameIsUnique();
    });
  });

  describe('Create a base location', () => {
    beforeEach(() => loginLocations());
    afterEach(() => removeLocation(NEW_BASE_LOCATION));
    describe('Without extra information', () => {
      it('generate location without auto checkout', () => {
        openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
        selectLocationType(BASE_TYPE);
        setLocationName(NEW_BASE_LOCATION);
        // Keep address
        cy.getByCy('yes').click();
        setLocationPhone(E2E_PHONE_NUMBER);
        // Proceed by skipping average checkin time
        cy.getByCy('nextStep').click();
        setLocationIndoorSelection();
        // Disable auto checkout
        cy.getByCy('no').click();
        // Create location
        cy.getByCy('done').click();
        // No qr codes
        cy.getByCy('no').click();
        // Check if location got created
        cy.getByCy(`location-${NEW_BASE_LOCATION}`).should('exist');
      });
    });

    describe('With auto checkout', () => {
      it('generate new location', () => {
        openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
        selectLocationType(BASE_TYPE);
        setLocationName(NEW_BASE_LOCATION);
        // Keep address
        cy.getByCy('yes').click();
        setLocationPhone(E2E_PHONE_NUMBER);
        // Proceed by skipping average checkin time
        cy.getByCy('nextStep').click();
        setLocationIndoorSelection();
        // Enable auto checkout
        cy.getByCy('yes').click();
        setLocationRadius(100);
        // Create location
        cy.getByCy('done').click();
        // No qr codes
        cy.getByCy('no').click();
        // Check if location got created
        cy.getByCy(`location-${NEW_BASE_LOCATION}`).should('exist');
      });
    });
  });
});
