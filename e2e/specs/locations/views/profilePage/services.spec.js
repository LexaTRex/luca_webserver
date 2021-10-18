import { loginLocations } from '../../utils/auth';

import {
  PROFILE_ROUTE,
  TERMS_CONDITIONS_LINK,
  TOMS_FRAGMENT,
  DPA_FRAGMENT,
  PRIVACY_OPTIONAL_FRAGMENT,
  PRIVACY_MANDATORY_FRAGMENT,
} from '../../constants/routes';
import { E2E_EMAIL, E2E_PASSWORD } from '../../constants/users';

describe('Profile Services', () => {
  beforeEach(() => loginLocations(E2E_EMAIL, E2E_PASSWORD, PROFILE_ROUTE));

  it('can show the terms and conditions', () => {
    cy.getByCy('termsLink')
      .should('have.attr', 'href')
      .and('eq', TERMS_CONDITIONS_LINK);
  });
  it('can download the DPA', () => {
    cy.getByCy('dpaLink')
      .should('have.attr', 'href')
      .and('contain', DPA_FRAGMENT);
  });
  it('can download the privacy policy for locations which must collect data', () => {
    cy.getByCy('privacyLinkMandatory')
      .should('have.attr', 'href')
      .and('contain', PRIVACY_MANDATORY_FRAGMENT);
  });
  it('can download the toms for locations', () => {
    cy.getByCy('tomsLink')
      .should('have.attr', 'href')
      .and('contain', TOMS_FRAGMENT);
  });
  it('can download the privacy policy for locations which can collect data', () => {
    cy.getByCy('privacyLinkOptional')
      .should('have.attr', 'href')
      .and('contain', PRIVACY_OPTIONAL_FRAGMENT);
  });
});
