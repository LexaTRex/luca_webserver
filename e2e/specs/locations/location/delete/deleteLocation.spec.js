import { login } from '../../helpers/functions';
import { createLocation } from '../../helpers/functions';
import {
  E2E_DEFAULT_LOCATION_GROUP as groupId,
  TEST_LOCATION_NAME as locationName,
} from '../../helpers/locations';

describe('Delete location', () => {
  beforeEach(() => login());
  it('cannot delete the base location', () => {
    cy.getByCy('openSettings').click();
    cy.getByCy('deleteLocation').should('not.exist');
  });
  it('can delete a non-default location', () => {
    // Create a test location
    createLocation(groupId, locationName);
    cy.getByCy('locationDisplayName').should('contain', locationName);
    // Delete the test location
    cy.getByCy('openSettings').click();
    cy.getByCy('deleteLocation').should('exist');
    cy.getByCy('deleteLocation').click();
    cy.get('.ant-popover-buttons .ant-btn-primary').click();
    // Success notification
    cy.get('.successDeletedNotification').should('exist');
    // Expect that the test location doesn't exist in the link menu
    cy.getByCy('location-Test_location').should('not.exist');
  });
});
