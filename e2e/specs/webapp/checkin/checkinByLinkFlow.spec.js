import { createGroupPayload } from '../../locations/utils/payloads.helper';
import { clearDatabase } from '../helpers/database';
import { registerDevice } from '../helpers/functions';
import { removeHDPrivateKeyFile } from '../../workflow/helpers/functions';
import { addHealthDepartmentPrivateKeyFile } from '../../health-department/helper/ui/login.helper';
import { loginHealthDepartment } from '../../health-department/helper/api/auth.helper';
import { signHealthDepartment } from '../../health-department/helper/signHealthDepartment';
import { WEBAPP_ROUTE } from '../helpers/routes';
import { APP_ROUTE } from '../../locations/constants/routes';
import { deleteGroup } from '../../locations/utils/groups';

describe('WebApp / CheckIn', { retries: 3 }, () => {
  before(() => {
    removeHDPrivateKeyFile();
    cy.basicLoginLocations();
    cy.createGroup(createGroupPayload, false);
    cy.logoutLocations();
    loginHealthDepartment();
    signHealthDepartment();
    addHealthDepartmentPrivateKeyFile();
    cy.wait(1000);
    cy.logoutHD();
    cy.wait(1000);
    registerDevice();
  });

  after(() => {
    cy.basicLoginLocations();
    cy.visit(APP_ROUTE);
    cy.get('@groupId').then(groupId => {
      deleteGroup(groupId);
    });
    cy.logoutLocations();
    cy.wrap(clearDatabase());
  });

  it('checks in an webapp user via scanner', () => {
    cy.get('@scannerId').then(scannerId => {
      cy.visit(`${WEBAPP_ROUTE}/${scannerId}`);
    });
    cy.wait(1000);
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
