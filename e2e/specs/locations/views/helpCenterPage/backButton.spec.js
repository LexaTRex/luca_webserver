import {
  HELP_CENTER_ROUTE,
  DATA_TRANSFERS_ROUTE,
} from '../../constants/routes';
import { loginLocations } from '../../utils/auth';
import { E2E_DEFAULT_GROUP_NAME } from '../../constants/locations';

describe('Help center back button', () => {
  beforeEach(() => {
    loginLocations();
  });

  describe('Starting in location overview', () => {
    it('redirects to previous destinaton', () => {
      cy.getByCy('groupName').contains(E2E_DEFAULT_GROUP_NAME);
      cy.getByCy('locationDisplayName').contains('General');
      cy.visit(HELP_CENTER_ROUTE);
      cy.getByCy('helpCenterTitle');
      cy.getByCy('helpCenterBackButton').click();
      cy.getByCy('groupName').contains(E2E_DEFAULT_GROUP_NAME);
      cy.getByCy('locationDisplayName').contains('General');
    });
  });

  describe('Starting in share data view', () => {
    it('redirects to previous destinaton', () => {
      cy.visit(DATA_TRANSFERS_ROUTE);
      cy.getByCy('dataTransfers');
      cy.visit(HELP_CENTER_ROUTE);
      cy.getByCy('helpCenterTitle');
      cy.getByCy('helpCenterBackButton').click();
      cy.getByCy('dataTransfers');
    });
  });
});
