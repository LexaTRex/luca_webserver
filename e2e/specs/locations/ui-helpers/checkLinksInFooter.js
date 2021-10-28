/* eslint-disable */
import {
  FAQ_LINK,
  GITLAB_LINK,
  TERMS_CONDITIONS_LINK,
} from '../constants/links';

export const checkLinksInFooter = () => {
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
};
