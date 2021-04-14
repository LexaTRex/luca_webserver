import { login } from '../helpers/functions';
import {
  E2E_DEFAULT_LOCATION_NAME,
  E2E_SECOND_LOCATION_NAME,
} from '../helpers/locations';

const SETTING_NAME = 'tableSubdivision';
const TEST_TABLE_COUNT = '50';
const ERROR = 'Please provide the number of tables.';

describe('Table configuration ', () => {
  beforeEach(() => {
    login();
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    // Expect the switch button to be inative by default
    cy.getByCy('activateTableSubdivision').should(
      'have.attr',
      'aria-checked',
      'false'
    );
    // Activate
    cy.getByCy('activateTableSubdivision').click();
    // Expect the switch button to be ative
    cy.getByCy('activateTableSubdivision').should(
      'have.attr',
      'aria-checked',
      'true'
    );
  });

  afterEach(() => {
    // Deactivate / Reset
    cy.getByCy('activateTableSubdivision').click();
    cy.getByCy('activateTableSubdivision').should(
      'have.attr',
      'aria-checked',
      'false'
    );
  });

  it('cannot accept non-numberic input', () => {
    // Test case: empty
    cy.get('#tableCount').clear();
    cy.get('.ant-form-item-explain-error').should('contain', ERROR);
    // Test case: special charaters
    cy.get('#tableCount').type('####');
    cy.get('.ant-form-item-explain-error').should('contain', ERROR);
    // Test case: text
    cy.get('#tableCount').type('testing');
    cy.get('.ant-form-item-explain-error').should('contain', ERROR);
  });

  it('sets the count to 1 if the input is less than 1', () => {
    // Test case: negative number
    cy.get('#tableCount').clear().type('-10').blur();
    // Expect the table count value to be changed to 1
    cy.get('#tableCount').invoke('val').should('eq', '1');
    // Check if the count is persisted by re-opening the table configuration
    cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
    cy.getByCy(`location-${E2E_DEFAULT_LOCATION_NAME}`).click();
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    // Expect the status to be active after re-opening
    cy.getByCy('activateTableSubdivision').should(
      'have.attr',
      'aria-checked',
      'true'
    );
    // Expect the table count value to be 1
    cy.get('#tableCount').invoke('val').should('eq', '1');
  });

  it('can change the number of tables', () => {
    // Test case: positive number
    cy.get('#tableCount').clear().type(TEST_TABLE_COUNT);
    // Expect the table count value to be changed to the test count
    cy.get('#tableCount').invoke('val').should('eq', TEST_TABLE_COUNT);
    // Check if the count is persisted by re-opening the table configuration
    cy.getByCy(`location-${E2E_SECOND_LOCATION_NAME}`).click();
    cy.getByCy(`location-${E2E_DEFAULT_LOCATION_NAME}`).click();
    cy.getByCy(`locationCard-${SETTING_NAME}`).click();
    // Expect the status to be active after re-opening
    cy.getByCy('activateTableSubdivision').should(
      'have.attr',
      'aria-checked',
      'true'
    );
    // Expect the table count value to be the test count
    cy.get('#tableCount').invoke('val').should('eq', TEST_TABLE_COUNT);
  });
});
