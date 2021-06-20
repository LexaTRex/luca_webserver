export const clean = () => {
  cy.request('POST', '/api/internal/end2end/clean');
};
