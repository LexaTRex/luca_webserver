/* eslint-disable */
import { loginLocations } from '../utils/auth';
import { E2E_DEFAULT_GROUP_NAME } from '../constants/locations';
import {
  HELP_CENTER_ROUTE,
  DATA_TRANSFERS_ROUTE,
  PROFILE_ROUTE,
  APP_ROUTE,
} from '../constants/routes';

describe('Page navigation', () => {
  beforeEach(() => loginLocations());

  it('opens current location settings page', () => {
    cy.getByCy('groupName')
      .should('be.visible')
      .and('contain', `${E2E_DEFAULT_GROUP_NAME}`)
      .click();
    cy.getByCy('groupSettingsHeader')
      .should('be.visible')
      .and('contain', `${E2E_DEFAULT_GROUP_NAME}`);
  });
  it('opens create location modal', () => {
    cy.getByCy('createGroup').should('be.visible').click();
    cy.getByCy('selectGroupType').should('be.visible');
  });
  it('opens data transfer page', () => {
    cy.getByCy('dataRequests').click();
    cy.url().should('include', DATA_TRANSFERS_ROUTE);
    cy.getByCy('dataTransfersTitle').should('be.visible');
  });
  it('opens help center page', () => {
    cy.getByCy('buttonHelpCenter').click();
    cy.url().should('include', HELP_CENTER_ROUTE);
    cy.getByCy('helpCenterTitle').should('be.visible');
  });
  it('opens profile page', () => {
    cy.getByCy('dropdownMenuTrigger').click();
    cy.getByCy('profile').click();
    cy.url().should('include', PROFILE_ROUTE);
    cy.getByCy('profileOverview').should('be.visible');
  });

  describe('Luca logo opens general overview page', () => {
    it('opens base group overview from data transfers', () => {
      cy.visit(DATA_TRANSFERS_ROUTE);
      cy.getByCy('groupName').should('not.exist');
      cy.getByCy('home').click();
      cy.url().should('include', APP_ROUTE);
      cy.getByCy('groupName').contains(E2E_DEFAULT_GROUP_NAME);
      cy.getByCy('locationDisplayName').should('be.visible');
    });

    it('opens base group overview from profile', () => {
      cy.visit(PROFILE_ROUTE);
      cy.getByCy('groupName').should('not.exist');
      cy.getByCy('home').click();
      cy.url().should('include', APP_ROUTE);
      cy.getByCy('groupName').contains(E2E_DEFAULT_GROUP_NAME);
      cy.getByCy('locationDisplayName').should('be.visible');
    });
  });
});
