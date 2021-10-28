/* eslint-disable */
import { HELP_CENTER_ROUTE } from '../../../constants/routes';
import { getMe } from '../../../utils/operators';

describe('Send support mail modal', () => {
  beforeEach(() => {
    cy.basicLoginLocations();
    cy.visit(HELP_CENTER_ROUTE);
    getMe();
  });
  it('shows the correct operator values', () => {
    // Open contact modal
    cy.getByCy('helpCenterModalTrigger').should('exist').click();
    // Expect modal to open
    cy.getByCy('contactFormModal').should('be.visible');
    // Check if values exist
    cy.getByCy('contactFormOperatorSupportCode').should('exist');
    cy.getByCy('contactFormOperatorName').should('exist');
    cy.getByCy('contactFormOperatorEmail').should('exist');
    // Compare displayed values to operator values
    cy.get('@operator').then(operator => {
      cy.getByCy('contactFormOperatorEmail').should(
        'have.text',
        operator.email
      );
      cy.getByCy('contactFormOperatorName').should(
        'have.text',
        `${operator.firstName} ${operator.lastName}`
      );
      cy.getByCy('contactFormOperatorSupportCode').should(
        'have.text',
        operator.supportCode
      );
    });
  });
});
