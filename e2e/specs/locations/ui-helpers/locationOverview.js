/* eslint-disable */
export const checkoutGuests = () => {
  cy.getByCy('checkoutGuest').click();
  cy.get('.ant-popover-buttons .ant-btn-primary').click();
  cy.get('.successCheckout').should('exist');
};
