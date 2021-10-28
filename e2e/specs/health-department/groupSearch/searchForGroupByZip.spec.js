/* eslint-disable */
import { loginHealthDepartment } from '../helper/api/auth.helper';
import { createGroupPayload } from '../../locations/utils/payloads.helper';
import { APP_ROUTE } from '../../locations/constants/routes';
import { deleteGroup } from '../../locations/utils/groups';
import { signHealthDepartment } from '../helper/signHealthDepartment';
import { addHealthDepartmentPrivateKeyFile } from '../helper/ui/handlePrivateKeyFile';

const FIRST_GROUP_NAME = 'test group first';
const SECOND_GROUP_NAME = 'test group second';
const THIRD_GROUP_NAME = 'not matching group';
const ZIP_CODE_MATCHED = '12345';
const ZIP_CODE_MISMATCHED = '54321';
const GROUP_ZIP_MAP = {
  [FIRST_GROUP_NAME]: ZIP_CODE_MATCHED,
  [SECOND_GROUP_NAME]: ZIP_CODE_MISMATCHED,
  [THIRD_GROUP_NAME]: ZIP_CODE_MATCHED,
};
const GROUP_IDS = [];
const GROUP_PREFIX = 'group_';
const SEARCH_TERM = 'tes';

describe('Health Department / Group search / Search for a group by Name and Zip code', () => {
  // create groups with different names and zip codes
  before(() => {
    cy.basicLoginLocations();
    for (const [key, value] of Object.entries(GROUP_ZIP_MAP)) {
      cy.createGroup({ ...createGroupPayload, name: key, zipCode: value });
      cy.get('@groupId').then(groupId => {
        GROUP_IDS.push(groupId);
      });
    }
    cy.logoutLocations();
  });

  beforeEach(() => {
    loginHealthDepartment();
    signHealthDepartment();
    addHealthDepartmentPrivateKeyFile();
  });

  // delete created groups
  after(() => {
    cy.basicLoginLocations();
    cy.visit(APP_ROUTE);
    cy.url().should('contain', APP_ROUTE);
    GROUP_IDS.forEach(id => deleteGroup(id));
  });

  describe('when searching for groups by zip code', () => {
    it('disables the search button', () => {
      cy.getByCy('searchGroup').should('exist').should('be.visible').click();
      // search group by term
      cy.get('.ant-modal-content').within(() => {
        cy.get('#zipCode')
          .should('exist')
          .should('be.visible')
          .type(ZIP_CODE_MATCHED);
        cy.getByCy('startGroupSearch').should('exist').should('be.disabled');
      });
    });
  });

  describe('when searching for a groups by Name and Zip code', () => {
    it('displays groups matching search criteria', () => {
      cy.getByCy('searchGroup').should('exist').should('be.visible').click();
      // search groups by name and zip
      cy.get('.ant-modal-content').within(() => {
        cy.getByCy('groupNameInput')
          .should('exist')
          .should('be.visible')
          .type(SEARCH_TERM);
        cy.get('#zipCode')
          .should('exist')
          .should('be.visible')
          .type(ZIP_CODE_MATCHED);
        cy.getByCy('startGroupSearch')
          .should('exist')
          .should('be.visible')
          .click();
        // verify one group matching name and zip is found
        cy.getByCy(GROUP_PREFIX + FIRST_GROUP_NAME)
          .should('exist')
          .should('be.visible');
        cy.getByCy(GROUP_PREFIX + FIRST_GROUP_NAME)
          .children()
          .then($group => {
            expect($group.text()).contains(FIRST_GROUP_NAME);
            expect($group.text()).contains(
              `${createGroupPayload.streetName} ${createGroupPayload.streetNr}, ${ZIP_CODE_MATCHED} ${createGroupPayload.city}`
            );
          });
        // verify groups with different name or zip are not found
        cy.getByCy(GROUP_PREFIX + SECOND_GROUP_NAME).should('not.exist');
        cy.getByCy(GROUP_PREFIX + THIRD_GROUP_NAME).should('not.exist');
      });
    });
  });
});
