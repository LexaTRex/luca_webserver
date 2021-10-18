import { loginLocations } from '../../utils/auth';
import {
  E2E_DEFAULT_LOCATION_NAME,
  E2E_SECOND_LOCATION_NAME,
  E2E_THIRD_LOCATION_NAME,
  E2E_DEFAULT_LOCATION_UUID,
  E2E_SECOND_LOCATION_UUID,
  TEST_LOCATION_NAME,
  TEST_NUMBER,
} from '../../constants/locations';
import { E2E_PHONE_NUMBER } from '../../constants/users';

describe('Location settings', () => {
  beforeEach(() => {
    loginLocations();
    // Expect the default location
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_DEFAULT_LOCATION_NAME
    );
  });
  describe('Edit the base location', () => {
    it('has disabled save button if there is no change', () => {
      cy.getByCy('openSettings').click();
      cy.getByCy('editLocation').should('be.disabled');
    });
    it('has disabled name input', () => {
      cy.getByCy('openSettings').click();
      cy.get('#locationName').should('be.disabled');
    });
    it('can change the phone number of the base location', () => {
      // Open the location settings
      cy.getByCy('openSettings').click();
      cy.get('#phone').should('be.visible');
      cy.get('#phone').clear().type(TEST_NUMBER);
      // Save the changes
      cy.getByCy('editLocation').click();
      // Success notification
      cy.get('.editLocationSuccess').should('exist');
      // Go back to the location overview
      cy.getByCy('toLocationOverview').click();
      // Reset the phone number
      cy.request(
        'PATCH',
        `api/v3/operators/locations/${E2E_DEFAULT_LOCATION_UUID}`,
        {
          phone: E2E_PHONE_NUMBER,
        }
      );
    });
  });
  describe('Edit other locations', () => {
    it('has disabled save button if there is no change', () => {
      // Click the other location
      cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
      cy.getByCy('locationDisplayName').should(
        'contain',
        E2E_SECOND_LOCATION_NAME
      );
      // Open the location settings
      cy.getByCy('openSettings').click();
      cy.getByCy('editLocation').should('be.disabled');
    });

    it('checks if the location name is the default name', () => {
      cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
      cy.getByCy('locationDisplayName').should(
        'contain',
        E2E_SECOND_LOCATION_NAME
      );
      cy.getByCy('openSettings').click();
      cy.get('#locationName').clear().type(E2E_DEFAULT_LOCATION_NAME);
      cy.getByCy('editLocation').click();
      cy.get('.ant-form-item-explain-error').should('exist');
    });

    it('checks if the location name is unique', () => {
      cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
      cy.getByCy('locationDisplayName').should(
        'contain',
        E2E_SECOND_LOCATION_NAME
      );
      cy.getByCy('openSettings').click();
      cy.get('#locationName').clear().type(E2E_THIRD_LOCATION_NAME);
      cy.getByCy('editLocation').click();
      cy.get('.ant-form-item-explain-error').should('exist');
    });

    it('can change both the name and phone number of the location', () => {
      // Click the other location
      cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
      cy.getByCy('locationDisplayName').should(
        'contain',
        E2E_SECOND_LOCATION_NAME
      );
      // Open the location settings
      cy.getByCy('openSettings').click();
      cy.get('#locationName').clear().type(TEST_LOCATION_NAME);
      cy.get('#phone').clear().type(TEST_NUMBER);
      // Save the changes
      cy.getByCy('editLocation').click();
      // Success notification
      cy.get('.editLocationSuccess').should('exist');
      // Go back to the location overview
      cy.getByCy('toLocationOverview').click();
      // Expect the new location name on the overview page
      cy.getByCy(`location-${TEST_LOCATION_NAME}`).should('exist');
      // Reset the location name and the phone number
      cy.request(
        'PATCH',
        `api/v3/operators/locations/${E2E_SECOND_LOCATION_UUID}`,
        {
          locationName: E2E_SECOND_LOCATION_NAME,
          phone: E2E_PHONE_NUMBER,
        }
      );
    });
  });
});

// TODO: CHECK IF THIS IS SUPPOSED TO BE INSIDE AREA SETTINGS
