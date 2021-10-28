/* eslint-disable */
import { loginLocations } from '../utils/auth';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  E2E_DEFAULT_LOCATION_GROUP_2,
  E2E_DEFAULT_GROUP_NAME,
  E2E_GROUP_NAME_2,
} from '../constants/locations';
import { createGroupPayload } from '../utils/payloads.helper';
import { deleteGroup } from '../utils/groups';
import { APP_ROUTE } from '../constants/routes';

const GROUPS = ['Nexenio_3 e2e', 'Nexenio_4 e2e'];
const GROUP_IDS = [];

context('Change groups', () => {
  describe('when searchable select is not present', () => {
    before(() => loginLocations());
    it('can change groups if there are only two groups', () => {
      cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
      cy.getByCy('selectGroupDropdown').click();
      cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP_2}`).click();
      cy.getByCy('groupName').should('contain', E2E_GROUP_NAME_2);
      cy.getByCy('selectGroupDropdown').click();
      cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
    });
  });

  describe('when searchable select is present', () => {
    before(() => {
      cy.basicLoginLocations();
      cy.visit(APP_ROUTE);
      GROUPS.forEach(group => {
        cy.createGroup({ ...createGroupPayload, name: group });
        cy.get('@groupId').then(groupId => {
          GROUP_IDS.push(groupId);
        });
      });
    });
    after(() => {
      cy.basicLoginLocations();
      cy.visit(APP_ROUTE);
      GROUP_IDS.forEach(id => deleteGroup(id));
    });

    it('can change groups if there are more than two groups', () => {
      cy.getByCy('selectGroupDropdown').click();
      cy.getByCy('groupSelect').click();
      cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP_2}`).click();
      cy.getByCy('groupName').should('contain', E2E_GROUP_NAME_2);
      cy.getByCy('selectGroupDropdown').click();
      cy.getByCy('groupSelect').click();
      cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
      // Search for a group
      cy.getByCy('selectGroupDropdown').click();
      cy.getByCy('groupSelect').type(`${E2E_GROUP_NAME_2}{enter}`);
      cy.getByCy('groupName').should('contain', E2E_GROUP_NAME_2);
    });
  });
});
