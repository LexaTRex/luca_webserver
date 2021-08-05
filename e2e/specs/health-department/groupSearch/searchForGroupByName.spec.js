import { login, logout, createGroup, deleteGroup } from '../../locations/helpers/functions';
import { loginHealthDepartment } from '../helper/api/auth.helper';
import { addHealthDepartmentPrivateKeyFile } from '../helper/ui/login.helper';
import { createGroupPayload } from '../../locations/helpers/functions.helper';

const FIRST_GROUP_NAME = 'test group first';
const SECOND_GROUP_NAME = 'second test@group';
const THIRD_GROUP_NAME = 'not matching group';
const GROUPS = [FIRST_GROUP_NAME, SECOND_GROUP_NAME, THIRD_GROUP_NAME];
const MATCHED_GROUPS = [FIRST_GROUP_NAME, SECOND_GROUP_NAME];
const GROUP_IDS = [];
const GROUP_PREFIX = 'group_';
const SEARCH_TERM = 'tes';


describe('Health Department / Group search / Search for a group', () => {
  //create groups with different names
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
  //delete created groups
  after(() => {
    login();
    GROUP_IDS.forEach(id => deleteGroup(id));
  });

  describe('when searching for groups by name', () => {
    it('display groups matching search term', () => {
      loginHealthDepartment();
      addHealthDepartmentPrivateKeyFile();
      cy.getByCy('searchGroup').should('exist').should('be.visible').click();
      //search group by term
      cy.get('.ant-modal-content').within(($modal) => {
        cy.getByCy('groupNameInput').should('exist').should('be.visible').type(SEARCH_TERM);
        cy.getByCy('startGroupSearch').should('exist').should('be.visible').click();
        //verify 2 groups are found and one is noot
        MATCHED_GROUPS.forEach((group) => {
          cy.getByCy(GROUP_PREFIX + group).should('exist').should('be.visible');
          cy.getByCy(GROUP_PREFIX + group).children().then(($group) => {
            expect($group.text()).contains(group);
            expect($group.text()).contains(createGroupPayload.streetName + ' ' + createGroupPayload.streetNr + ', ' + createGroupPayload.zipCode + ' ' + createGroupPayload.city);
          });
        });
        cy.getByCy(GROUP_PREFIX + THIRD_GROUP_NAME).should('not.exist');
      });
    });
  });
});
