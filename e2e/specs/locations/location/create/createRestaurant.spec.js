import { login } from '../../helpers/functions';
import { removeLocation } from '../location.helper';
import { E2E_PHONE_NUMBER } from '../../helpers/users';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  RESTAURANT_TYPE,
  NEW_RESTAURANT_LOCATION,
} from '../../helpers/locations';
import {
  defaultLocationNameShouldBeRejected,
  checkLocationNameIsUnique,
} from '../../helpers/inputValidation.helper';
import {
  openCreateLocationModal,
  selectLocationType,
  setLocationName,
  setLocationPhone,
  setLocationIndoorSelection,
  setLocationTableCount,
  setLocationRadius,
} from '../../helpers/createLocation.helper';

context('Create restaurant location', () => {
  describe('Location name validation', () => {
    beforeEach(() => login());
    it('checks if the location name is the default name', () => {
      openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
      selectLocationType(RESTAURANT_TYPE);
      defaultLocationNameShouldBeRejected();
    });
    it('checks if the location name is unique', () => {
      openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
      selectLocationType(RESTAURANT_TYPE);
      checkLocationNameIsUnique();
    });
  });

  describe('Create a restaurant location', () => {
    beforeEach(() => login());
    afterEach(() => removeLocation(NEW_RESTAURANT_LOCATION));
    describe('Without extra information', () => {
      it('generate location without tables and auto checkout', () => {
        openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
        selectLocationType(RESTAURANT_TYPE);
        setLocationName(NEW_RESTAURANT_LOCATION);
        // Keep address
        cy.getByCy('yes').click();
        setLocationPhone(E2E_PHONE_NUMBER);
        // Proceed by skipping average checkin time
        cy.getByCy('nextStep').click();
        setLocationIndoorSelection();
        // No tables
        cy.getByCy('no').click();
        // Disable auto checkout
        cy.getByCy('no').click();
        // Create location
        cy.getByCy('done').click();
        // No qr codes
        cy.getByCy('no').click();
        // Check if location got created
        cy.getByCy(`location-${NEW_RESTAURANT_LOCATION}`);
      });
    });
    describe('With tables', () => {
      it('with tables', () => {
        openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
        selectLocationType(RESTAURANT_TYPE);
        setLocationName(NEW_RESTAURANT_LOCATION);
        // Keep address
        cy.getByCy('yes').click();
        setLocationPhone(E2E_PHONE_NUMBER);
        // Proceed by skipping average checkin time
        cy.getByCy('nextStep').click();
        setLocationIndoorSelection();
        // Enable tables
        cy.getByCy('yes').click();
        setLocationTableCount('10');
        // Disable auto checkout
        cy.getByCy('no').click();
        // Create location
        cy.getByCy('done').click();
        // No qr codes
        cy.getByCy('no').click();
        // Check if location got created
        cy.getByCy(`location-${NEW_RESTAURANT_LOCATION}`);
      });
    });

    describe('With auto checkout', () => {
      it('generate location with auto checkout', () => {
        openCreateLocationModal(E2E_DEFAULT_LOCATION_GROUP);
        selectLocationType(RESTAURANT_TYPE);
        setLocationName(NEW_RESTAURANT_LOCATION);
        // Keep address
        cy.getByCy('yes').click();
        setLocationPhone(E2E_PHONE_NUMBER);
        // Proceed by skipping average checkin time
        cy.getByCy('nextStep').click();
        setLocationIndoorSelection();
        // No tables
        cy.getByCy('no').click();
        // Enable auto checkout
        cy.getByCy('yes').click();
        setLocationRadius(100);
        // Create location
        cy.getByCy('done').click();
        // No qr codes
        cy.getByCy('no').click();
        // Check if location got created
        cy.getByCy(`location-${NEW_RESTAURANT_LOCATION}`);
      });
    });
  });
});
