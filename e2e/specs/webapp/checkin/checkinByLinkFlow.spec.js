import { createGroupPayload } from '../../locations/helpers/functions.helper';
import {
  basicLocationLogin,
  createGroup,
  deleteGroup,
  logout,
} from '../../locations/helpers/functions';

import { clearDatabase } from '../helpers/database';
import { registerDevice } from '../helpers/functions';
import { clean } from '../../workflow/helpers/functions';
import { addHealthDepartmentPrivateKeyFile } from '../../health-department/helper/ui/login.helper';
import { loginHealthDepartment } from '../../health-department/helper/api/auth.helper';
import { signHealthDepartment } from '../../health-department/helper/signHealthDepartment';
import { WEBAPP_ROUTE, LOCATIONS_ROUTE } from '../helpers/routes';
import { E2E_EMAIL, E2E_PASSWORD } from '../../locations/helpers/users';

describe('WebApp / CheckIn', { retries: 3 }, () => {
  before(() => {
    clean();
    basicLocationLogin();
    createGroup(createGroupPayload, false);
    logout();
    loginHealthDepartment();
    signHealthDepartment();
    addHealthDepartmentPrivateKeyFile();
    cy.wait(1000);
    registerDevice();
  });
  after(() => {
    basicLocationLogin(E2E_EMAIL, E2E_PASSWORD, false);
    cy.get('@groupId', { timeout: 10000 }).then(groupId => {
      deleteGroup(groupId);
    });
    logout();
    cy.wrap(clearDatabase());
  });
  describe('when an user checks in by link', () => {
    it('opens the checkout screen', () => {
      cy.visit(LOCATIONS_ROUTE);
      cy.get('@scannerId', { timeout: 10000 }).then(scannerId => {
        cy.visit(`${WEBAPP_ROUTE}/${scannerId}`);
      });
      cy.url({ timeout: 10000 }).should('contain', '/checkout');
      cy.getByCy('locationName').should('contain', createGroupPayload.name);

      // Simulate clock
      cy.clock(Date.now(), ['Date', 'setInterval', 'clearInterval']);

      // Simulate hook ticks
      for (let i = 0; i < 10; i++) {
        cy.tick(1000);
      }
      // 2 Minutes
      cy.tick(120000);

      // Simulate hook ticks
      for (let i = 0; i < 10; i++) {
        cy.tick(1000);
      }
      cy.getByCy('clockMinutes').should('contain', '02');
      cy.getByCy('checkout').click().tick(1000);
      cy.url({ timeout: 10000 }).should('not.contain', '/checkout');
      cy.clock().then(clock => clock.restore());
    });
  });
});
