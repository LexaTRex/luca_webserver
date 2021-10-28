/* eslint-disable */
import { loginLocations } from '../../../utils/auth';
import {
  E2E_DEFAULT_LOCATION_NAME,
  E2E_SECOND_LOCATION_NAME,
  E2E_THIRD_LOCATION_NAME,
} from '../../../constants/locations';

describe('Change area', () => {
  beforeEach(() => loginLocations());
  it('changes the settings overview when clicking on different areas', () => {
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_DEFAULT_LOCATION_NAME
    );
    cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_SECOND_LOCATION_NAME
    );

    cy.getByCy(`location-${E2E_THIRD_LOCATION_NAME}`).click();
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_THIRD_LOCATION_NAME
    );

    cy.getByCy(`location-${E2E_DEFAULT_LOCATION_NAME}`).click();
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_DEFAULT_LOCATION_NAME
    );
  });
});
