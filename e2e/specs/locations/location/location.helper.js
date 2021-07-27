export const removeLocation = locationName => {
  cy.intercept({
    method: 'DELETE',
    url: '/api/v3/operators/locations/*',
  }).as('deleteLocation');

  cy.getByCy(`location-${locationName}`).click();
  cy.getByCy('openSettings').click();
  cy.getByCy('deleteLocation').click();
  cy.get('.ant-popover-buttons .ant-btn-primary').click();

  cy.wait('@deleteLocation');
};
