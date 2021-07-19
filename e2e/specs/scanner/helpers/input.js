export const inputQRCodeData = data => {
    cy.get('input').type(data, {
      parseSpecialCharSequences: false,
    });
    cy.get('input').type('{enter}');
  };