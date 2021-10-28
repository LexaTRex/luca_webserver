/* eslint-disable */
import { loginLocations } from '../../utils/auth';
import { APP_ROUTE } from '../../constants/routes';
import { E2E_SECOND_LOCATION_NAME } from '../../constants/locations';

describe('Location overview - show location profile link', () => {
  beforeEach(() => loginLocations());
  it('opens the area settings page', () => {
    cy.url().should('include', APP_ROUTE);
    cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_SECOND_LOCATION_NAME
    );
    cy.getByCy('openSettings').click();
    cy.url().should('include', '/location/settings');
    cy.getByCy('areaSettingsHeading').should(
      'contain',
      E2E_SECOND_LOCATION_NAME
    );
  });
});
