import {createGroupPayload} from "../../locations/helpers/functions.helper";
import {basicLocationLogin, createGroup, deleteGroup, logout} from "../../locations/helpers/functions";

import {clearDatabase} from "../helpers/database";
import {registerDevice} from "../helpers/functions";
import {clean} from "../../workflow/helpers/functions";
import {
  addHealthDepartmentPrivateKeyFile,
} from "../../health-department/helper/ui/login.helper";
import {loginHealthDepartment} from "../../health-department/helper/api/auth.helper";
import {WEBAPP_ROUTE} from "../helpers/routes";

describe('WebApp / CheckIn', () => {
  before(() => {
    clean();
    basicLocationLogin();
    createGroup(createGroupPayload, false);
    logout();
    loginHealthDepartment();
    addHealthDepartmentPrivateKeyFile();
    cy.wait(1000);
    registerDevice();
  });
    after(() => {
      basicLocationLogin();
      cy.get('@groupId').then(groupId => {
        deleteGroup(groupId);
      });
      logout();
      cy.wrap(clearDatabase());
    });
    describe('when an user checkin by link', () => {
      it('open the checkout screen', () => {
        cy.get('@scannerId').then(scannerId => {
          cy.visit(`${WEBAPP_ROUTE}/${scannerId}`);
        });
        cy.url().should('contain', '/checkout')
        cy.getByCy('locationName').should('contain', createGroupPayload.name);

        // Simulate clock
        cy.clock(Date.now(), ['Date', 'setInterval', 'clearInterval'])

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
        cy.url().should('not.contain', '/checkout')
        cy.clock().then((clock) => clock.restore());
      });
    });
});
