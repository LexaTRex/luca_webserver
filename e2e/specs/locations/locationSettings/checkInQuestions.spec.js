import { login } from '../helpers/functions';
const SETTING_NAME = 'additionalData';
const TEST_DATA = 'Test Data';

describe('Checkin questions', () => {
  beforeEach(() => login());
  it('has no additional data', () => {
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    cy.getByCy('addRequestButton').should('not.exist');
  });
  it('adds two additional data keys', () => {
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    cy.getByCy('selectAdditionalData').click();
    cy.getByCy('addRequestButton').should('be.visible');
    cy.getByCy('addRequestButton').click();
    cy.get('#key').type(TEST_DATA);
  });
  it('removes additional data', () => {
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    cy.getByCy('removeAdditionalData').click();
    cy.getByCy('addRequestButton').should('not.exist');
  });
});
