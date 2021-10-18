import { getCreateLocationPayload } from './payloads.helper';
import { APP_ROUTE } from '../constants/routes';

export const createLocation = (groupId, locationName) => {
  cy.request(
    'POST',
    'api/v3/operators/locations/',
    getCreateLocationPayload(groupId, locationName)
  ).then(async response => {
    cy.request('GET', `api/v3/operators/locations/${response.body.uuid}`).then(
      response => {
        cy.visit(
          `${APP_ROUTE}/${response.body.groupId}/location/${response.body.uuid}`
        );
      }
    );
  });
};

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
