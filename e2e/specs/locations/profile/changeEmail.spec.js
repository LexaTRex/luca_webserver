import { login } from '../helpers/functions';
import { PROFILE_ROUTE } from '../helpers/routes';
import { E2E_EMAIL } from '../helpers/users';

const NEW_EMAIL = 'torsten.test@nexenio.com';

describe('Change Operator Email', () => {
  beforeEach(() => login(PROFILE_ROUTE));
  it('sends an request to change the mail', () => {
    // Expect operator email to equal db email
    cy.get('#email').should('have.value', `${E2E_EMAIL}`);
    // Expect email change info not to be visible
    cy.getByCy('activeEmailChange').should('not.exist');
    // Change email
    cy.get('#email').clear();
    cy.get('#email').type(NEW_EMAIL);
    cy.getByCy('changeOperatorName').click();
    // Expect old email to be gone
    cy.get('#email').should('not.have.value', `${E2E_EMAIL}`);
    // Expect new name to be set
    cy.get('#email').should('have.value', `${NEW_EMAIL}`);
    // Expect email change info to be visible
    cy.getByCy('activeEmailChange').should('exist');
  });
});
