import { login } from '../helpers/functions';
import { PROFILE_ROUTE } from '../helpers/routes';

import {
  TERMS_CONDITIONS_LINK,
  TOMS_FRAGMENT,
  DPA_FRAGMENT,
  PRIVACY_OPTIONAL_FRAGMENT,
  PRIVACY_MANDATORY_FRAGMENT,
} from '../helpers/routes';

describe('Profile Services', () => {
  beforeEach(() => login(PROFILE_ROUTE));
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
