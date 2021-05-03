export const checkRadiusInput = () => {
  // Invalid radius input (empty, under 50 or over 5000):
  cy.get('#radius').clear();
  cy.get('.ant-form-item-explain-error').should('exist');
  cy.get('#radius').clear().type(10);
  cy.get('.ant-form-item-explain-error').should('exist');
  cy.get('#radius').clear().type(5050);
  cy.get('.ant-form-item-explain-error').should('exist')
};

export const checkRadiusInputEdgeCase = () => {
  cy.get('#radius').clear().type('#%?@@');
  cy.get('.ant-form-item-explain-error').should('exist');
  cy.get('#radius').clear().type('testing');
  cy.get('.ant-form-item-explain-error').should('exist')
};
