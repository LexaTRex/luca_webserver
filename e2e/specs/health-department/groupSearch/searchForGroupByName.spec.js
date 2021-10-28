/* eslint-disable */
import { loginHealthDepartment } from '../helper/api/auth.helper';
import { createGroupPayload } from '../../locations/utils/payloads.helper';
import { APP_ROUTE } from '../../locations/constants/routes';
import { deleteGroup } from '../../locations/utils/groups';
import { signHealthDepartment } from '../helper/signHealthDepartment';
import { addHealthDepartmentPrivateKeyFile } from '../helper/ui/handlePrivateKeyFile';

const FIRST_GROUP_NAME = 'test group first';
const SECOND_GROUP_NAME = 'second test@group';
const THIRD_GROUP_NAME = 'not matching group';
const GROUPS = [FIRST_GROUP_NAME, SECOND_GROUP_NAME, THIRD_GROUP_NAME];
const MATCHED_GROUPS = [FIRST_GROUP_NAME, SECOND_GROUP_NAME];
const GROUP_IDS = [];
const GROUP_PREFIX = 'group_';
const SEARCH_TERM = 'tes';

describe('Health Department / Group search / Search for a group', () => {
  // create groups with different names
  before(() => {
    cy.basicLoginLocations();
    GROUPS.forEach(group => {
      cy.createGroup({ ...createGroupPayload, name: group });
      cy.get('@groupId').then(groupId => {
        GROUP_IDS.push(groupId);
      });
    });
    cy.logoutLocations();
  });
  // delete created groups
  after(() => {
    cy.basicLoginLocations();
    cy.visit(APP_ROUTE);
    cy.url().should('contain', APP_ROUTE);
    GROUP_IDS.forEach(id => deleteGroup(id));
  });

  describe('when searching for groups by name', () => {
    it('display groups matching search term', () => {
      loginHealthDepartment();
      signHealthDepartment();
      addHealthDepartmentPrivateKeyFile();
      cy.getByCy('searchGroup').should('exist').should('be.visible').click();
      // search group by term
      cy.get('.ant-modal-content').within(() => {
        cy.getByCy('groupNameInput')
          .should('exist')
          .should('be.visible')
          .type(SEARCH_TERM);
        cy.getByCy('startGroupSearch')
          .should('exist')
          .should('be.visible')
          .click();
        // verify 2 groups are found and one is not
        MATCHED_GROUPS.forEach(group => {
          cy.getByCy(GROUP_PREFIX + group)
            .first()
            .scrollIntoView()
            .should('exist')
            .should('be.visible');
          cy.getByCy(GROUP_PREFIX + group)
            .first()
            .scrollIntoView()
            .children()
            .then($group => {
              expect($group.text()).contains(group);
              expect($group.text()).contains(
                `${createGroupPayload.streetName} ${createGroupPayload.streetNr}, ${createGroupPayload.zipCode} ${createGroupPayload.city}`
              );
            });
        });
        cy.getByCy(GROUP_PREFIX + THIRD_GROUP_NAME).should('not.exist');
      });
    });
  });
});
