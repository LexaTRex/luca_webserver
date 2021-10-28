/* eslint-disable */
import { loginLocations } from '../utils/auth';

describe('Logout', () => {
  before(() => {
    Cypress.config('chromeWebSecurity', true);
    loginLocations();
  });
  it('logs the user out', () => {
    cy.logoutLocations().then(response => {
      expect(response.status).to.eq(204);
    });
  });
});
