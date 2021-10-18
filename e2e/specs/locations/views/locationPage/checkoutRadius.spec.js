import { loginLocations } from '../../utils/auth';
import {
  E2E_SECOND_LOCATION_NAME,
  E2E_DEFAULT_LOCATION_NAME,
} from '../../constants/locations';
import {
  checkRadiusInput,
  checkRadiusInputEdgeCase,
} from '../../ui-helpers/validations';
const SETTING_NAME = 'checkoutRadius';

describe('Checkout radius configuration ', () => {
  beforeEach(() => {
    loginLocations();
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

  it('cannot accept invalid inputs', () => {
    // Invalid radius input: empty, under 50 or over 5000
    checkRadiusInput();
    // Invalid radius input: letters and special characters
    checkRadiusInputEdgeCase();
  });

  it('sets the invalid number to the minimum or maximum', () => {
    // Under 50
    cy.get('#radius').clear().type('-20').blur();
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
    cy.get('#radius').invoke('val').should('eq', '50');
    // Over 5000
    cy.get('#radius').clear().type('6000').blur();
    cy.get('#radius').invoke('val').should('eq', '5000');
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
    cy.get('#radius').invoke('val').should('eq', '5000');
  });

  it('can change the checkout radius', () => {
    cy.get('#radius').clear().type('100').blur();
    cy.get('#radius').invoke('val').should('eq', '100');
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
    cy.get('#radius').invoke('val').should('eq', '100');
  });
});
