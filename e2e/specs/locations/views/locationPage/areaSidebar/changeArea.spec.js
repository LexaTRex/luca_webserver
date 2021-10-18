import { loginLocations } from '../../../utils/auth';
import {
  E2E_DEFAULT_LOCATION_NAME,
  E2E_SECOND_LOCATION_NAME,
} from '../../../constants/locations';

describe('Change locations', () => {
  beforeEach(() => loginLocations());
  it('can change the location', () => {
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_DEFAULT_LOCATION_NAME
    );
    cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_SECOND_LOCATION_NAME
    );
    cy.getByCy(`location-${E2E_DEFAULT_LOCATION_NAME}`).click();
    cy.getByCy('locationDisplayName').should(
      'contain',
      E2E_DEFAULT_LOCATION_NAME
    );
  });
});
