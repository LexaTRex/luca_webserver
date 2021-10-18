import { loginLocations } from '../utils/auth';
import { HELP_CENTER_ROUTE, DATA_TRANSFERS_ROUTE } from '../constants/routes';

describe('Page navigation', () => {
  beforeEach(() => loginLocations());
  it('opens the help center page', () => {
    cy.getByCy('buttonHelpCenter').click();
    cy.url().should('include', HELP_CENTER_ROUTE);
    cy.getByCy('helpCenterTitle').should('be.visible');
    cy.getByCy('helpCenterWrapper').should('exist');
    cy.getByCy('helpCenterLinks').should('be.visible');
    cy.getByCy('helpCenterContact').should('be.visible');
  });
  it('opens the data transfer page', () => {
    cy.getByCy('dataRequests').click();
    cy.url().should('include', DATA_TRANSFERS_ROUTE);
    cy.getByCy('dataTransfers').should('exist');
  });
  it('opens profile page', () => {
    cy.getByCy('dropdownMenuTrigger').should('exist').click();
    cy.getByCy('profile').click();
    cy.getByCy('profileOverview').should('exist');
  });
});
