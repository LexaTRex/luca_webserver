import { HEALTH_DEPARTMENT_APP_ROUTE } from '../routes';
import {
  E2E_HEALTH_DEPARTMENT_USERNAME,
  E2E_HEALTH_DEPARTMENT_PASSWORD,
} from '../user';

const appTracking = '/app/tracking';

export const loginHealthDepartment = (
  username = E2E_HEALTH_DEPARTMENT_USERNAME,
  password = E2E_HEALTH_DEPARTMENT_PASSWORD
) => {
  cy.basicLoginHD(username, password);
  cy.visit(HEALTH_DEPARTMENT_APP_ROUTE, {
    onBeforeLoad: win => {
      win.sessionStorage.clear();
    },
  });
  cy.url().should('include', appTracking);
};
