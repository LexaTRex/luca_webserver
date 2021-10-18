import {
  FAQ_LINK,
  GITLAB_LINK,
  TERMS_CONDITIONS_LINK,
} from '../../constants/links';
import { REGISTER_ROUTE } from '../../constants/routes';

describe('Register page has the correct links in the footer', () => {
  beforeEach(() => {
    cy.visit(REGISTER_ROUTE);
  });

  it('opens FAQ link link in new tab', () => {
    cy.getByCy('faqLink').should('have.attr', 'href').and('eq', FAQ_LINK);
  });

  it('opens GitLab link in new tab', () => {
    cy.getByCy('gitLabLink').should('have.attr', 'href').and('eq', GITLAB_LINK);
  });

  it('opens terms and conditions link in new tab', () => {
    cy.getByCy('termsAndConditionsLink')
      .should('have.attr', 'href')
      .and('eq', TERMS_CONDITIONS_LINK);
  });

  it('shows the latest/most recent version of luca Location ', () => {
    cy.getByCy('lucaVersionHeadline').should('not.have.text', '');
    cy.getByCy('lucaVersionNumber').should('not.have.text', '');
  });
});
