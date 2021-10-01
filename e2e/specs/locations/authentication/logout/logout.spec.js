import { login } from '../../helpers/functions';

describe('Logout', () => {
  beforeEach(() => login());
  it('logs the user out', () => {
    cy.getByCy('createGroup').should('exist');
    cy.getByCy('dropdownMenuTrigger').click();
    cy.getByCy('logout').click();
    cy.getByCy('loginPage').should('exist');
    cy.get('#email').should('exist');
  });
});
