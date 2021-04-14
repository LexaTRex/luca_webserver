import { login } from '../helpers/functions';
import {
  E2E_SECOND_LOCATION_NAME,
  E2E_DEFAULT_LOCATION_NAME,
} from '../helpers/locations';
const SETTING_NAME = 'checkoutRadius';
const TEST_RADIUS = '100';

describe('Checkout radius configuration ', () => {
  beforeEach(() => {
    login();
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    // Expect the status to be inactive by default
    cy.getByCy('activateCheckoutRadius').should(
      'have.attr',
      'aria-checked',
      'false'
    );
    // Activate
    cy.getByCy('activateCheckoutRadius').click();
    // Expect the switch button to be ative
    cy.getByCy('activateCheckoutRadius').should(
      'have.attr',
      'aria-checked',
      'true'
    );
    cy.get('#radius').should('be.visible');
  });
  afterEach(() => {
    // Deactivate / Reset
    cy.getByCy('activateCheckoutRadius').click();
    cy.getByCy('activateCheckoutRadius').should(
      'have.attr',
      'aria-checked',
      'false'
    );
  });

  it('cannot accept non-numberic input', () => {
    // Test case: empty input
    cy.get('#radius').clear();
    cy.get('.ant-form-item-explain-error').should('exist');
    // Test case: special characters
    cy.get('#radius').type('####');
    cy.get('.ant-form-item-explain-error').should('exist');
    // Test case: text
    cy.get('#radius').type('testing');
    cy.get('.ant-form-item-explain-error').should('exist');
  });

  it('sets the number to 50 if the input number is under 50', () => {
    // Test cases: numbers under 50
    cy.get('#radius').clear().type('45');
    cy.get('.ant-form-item-explain-error').should('exist');
    cy.get('#radius').clear().type('0');
    cy.get('.ant-form-item-explain-error').should('exist');
    cy.get('#radius').clear().type('-20').blur();
    // Expect the table count value to be changed to 1
    cy.get('#radius').invoke('val').should('eq', '50');
    // Check if the radius number is persisted by re-opening the radius configuration
    cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
    cy.getByCy(`location-${E2E_DEFAULT_LOCATION_NAME}`).click();
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    // Expect the status to be active after re-opening
    cy.getByCy('activateCheckoutRadius').should(
      'have.attr',
      'aria-checked',
      'true'
    );
    // Expect the radius value to be 50
    cy.get('#radius').invoke('val').should('eq', '50');
  });

  it('can change the checkout radius', () => {
    // Test case: number greater than 50
    cy.get('#radius').clear().type(TEST_RADIUS);
    // Expect the value to be changed to the test radius number
    cy.get('#radius').invoke('val').should('eq', TEST_RADIUS);
    // Check if the radius number is persisted by re-opening the radius configuration
    cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
    cy.getByCy(`location-${E2E_DEFAULT_LOCATION_NAME}`).click();
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    // Expect the status to be active after re-opening
    cy.getByCy('activateCheckoutRadius').should(
      'have.attr',
      'aria-checked',
      'true'
    );
    // Expect the radius value to be the test radius number
    cy.get('#radius').invoke('val').should('eq', TEST_RADIUS);
  });
});
