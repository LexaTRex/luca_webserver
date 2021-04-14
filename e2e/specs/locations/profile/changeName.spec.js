import { login, resetUserName } from '../helpers/functions';
import { PROFILE_ROUTE } from '../helpers/routes';
import { E2E_FIRSTNAME, E2E_LASTNAME } from '../helpers/users';

const NEW_FIRSTNAME = 'Donald';
const NEW_LASTNAME = 'Duck';

describe('Change Operator Name', () => {
  beforeEach(() => login(PROFILE_ROUTE));
  afterEach(() => resetUserName());
  it('changes the operator name', () => {
    cy.getByCy('operatorName').should(
      'contain',
      `${E2E_FIRSTNAME} ${E2E_LASTNAME}`
    );
    cy.get('#firstName').should('have.value', `${E2E_FIRSTNAME}`);
    cy.get('#lastName').should('have.value', `${E2E_LASTNAME}`);
    // Expect operator name to equal db name in header and inputs
    // Change name
    cy.get('#firstName').clear();
    cy.get('#lastName').clear();
    cy.get('#firstName').type(NEW_FIRSTNAME);
    cy.get('#lastName').type(NEW_LASTNAME);
    cy.getByCy('changeOperatorName').click();
    // Expect old name to be gone
    cy.getByCy('operatorName').should(
      'not.contain',
      `${E2E_FIRSTNAME} ${E2E_LASTNAME}`
    );
    cy.get('#firstName').should('not.have.value', `${E2E_FIRSTNAME}`);
    cy.get('#lastName').should('not.have.value', `${E2E_LASTNAME}`);
    // Expect new name to be set
    cy.getByCy('operatorName').should(
      'contain',
      `${NEW_FIRSTNAME} ${NEW_LASTNAME}`
    );
    cy.get('#firstName').should('have.value', `${NEW_FIRSTNAME}`);
    cy.get('#lastName').should('have.value', `${NEW_LASTNAME}`);
  });
});
