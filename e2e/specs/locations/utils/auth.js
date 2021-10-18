import { APP_ROUTE } from '../constants/routes';
import { E2E_EMAIL, E2E_PASSWORD } from '../constants/users';
import { addLocationPrivateKeyFile } from '../ui-helpers/handlePrivateKeyFile';

export const loginLocations = (
  username = E2E_EMAIL,
  password = E2E_PASSWORD,
  route = APP_ROUTE
) => {
  cy.basicLoginLocations(username, password);
  cy.intercept({ method: 'GET', url: '**/me' }).as('me');
  cy.visit(APP_ROUTE, {
    onBeforeLoad: win => {
      win.sessionStorage.clear();
    },
  });
  cy.wait('@me');
  addLocationPrivateKeyFile();
  cy.visit(route);
};
