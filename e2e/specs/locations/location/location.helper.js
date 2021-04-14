export const removeLocation = locationName => {
  cy.getByCy(`location-${locationName}`).click();
  cy.getByCy('openSettings').click();
  cy.getByCy('deleteLocation').click();
  cy.get('.ant-popover-buttons .ant-btn-primary').click();
};
