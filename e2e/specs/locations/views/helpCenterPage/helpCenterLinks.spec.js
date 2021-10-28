/* eslint-disable */
import { HELP_CENTER_ROUTE, LICENSES_ROUTE } from '../../constants/routes';
import { FAQ_LINK, VIDEOS_LINK, TOOLKIT_LINK } from '../../constants/links';
import { loginLocations } from '../../utils/auth';
import { E2E_EMAIL, E2E_PASSWORD } from '../../constants/users';

describe('Help center link section', () => {
  beforeEach(() => {
    loginLocations(E2E_EMAIL, E2E_PASSWORD, HELP_CENTER_ROUTE);
    cy.getByCy('helpCenterLinks').should('exist');
  });

  it('opens the correct support video link', () => {
    cy.getByCy('supportVideoLink')
      .should('have.attr', 'href')
      .and('eq', VIDEOS_LINK);
  });

  it('opens the correct FAQ link', () => {
    cy.getByCy('faqLink').should('have.attr', 'href').and('eq', FAQ_LINK);
  });

  it('opens the correct toolkit link', () => {
    cy.getByCy('toolkitLink')
      .should('have.attr', 'href')
      .and('eq', TOOLKIT_LINK);
  });

  it('opens the correct license link', () => {
    cy.getByCy('licenseLink')
      .should('have.attr', 'href')
      .and('eq', LICENSES_ROUTE);
  });
});
