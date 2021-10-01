import {
  createGroup,
  deleteGroup,
  login,
  logout,
  resetGroups,
} from '../../helpers/functions';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  E2E_DEFAULT_LOCATION_GROUP_2,
  E2E_DEFAULT_GROUP_NAME,
  E2E_GROUP_NAME_2,
} from '../../helpers/locations';
import { createGroupPayload } from '../../helpers/functions.helper';

const GROUPS = [
  'Nexenio_3 e2e',
  'Nexenio_4 e2e',
];
const GROUP_IDS = [];

describe('Change groups', () => {
  before(() => {
    login();
    resetGroups();
    logout();
  });
  beforeEach(() => login());

  it('can change groups', () => {
    cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
    cy.getByCy('selectGroupDropdown').click();
    cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP_2}`).click();
    cy.getByCy('groupName').should('contain', E2E_GROUP_NAME_2);
    cy.getByCy('selectGroupDropdown').click();
    cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP}`).click();
    cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
  });

  describe('when searchable select is present', () => {
    before(() => {
      login();
      GROUPS.forEach(group => {
        createGroup({ ...createGroupPayload, name: group });
        cy.get('@groupId').then(groupId => {
          GROUP_IDS.push(groupId);
        });
      });
      logout();
    });
    after(() => {
      login();
      GROUP_IDS.forEach(id => deleteGroup(id));
    });

    it('can change groups in select', () => {
      cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
      cy.getByCy('selectGroupDropdown').click();
      cy.getByCy('groupSelect').click();
      cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP_2}`).click();
      cy.getByCy('groupName').should('contain', E2E_GROUP_NAME_2);
      cy.getByCy('selectGroupDropdown').click();
      cy.getByCy('groupSelect').click();
      cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
    });

    it('can search for groups', () => {
      cy.getByCy('selectGroupDropdown').click();
      cy.getByCy('groupSelect').type(`${E2E_GROUP_NAME_2}{enter}`);
      cy.getByCy('groupName').should('contain', E2E_GROUP_NAME_2);
    });
  });
});
