/* eslint-disable */
import { loginLocations } from '../../utils/auth';

import { E2E_DEFAULT_GROUP_NAME } from '../../constants/locations';
import { resetGroupName } from '../../utils/groups';

const NEW_GROUP_NAME = 'Edited group name';

describe('Group editing', () => {
  beforeEach(() => loginLocations());
  it('changes the name of the group', () => {
    cy.getByCy('groupName').should('exist');
    cy.getByCy('groupName').should('contain', `${E2E_DEFAULT_GROUP_NAME}`);
    cy.getByCy('groupName').click();
    cy.getByCy('groupSettingsHeader').should(
      'contain',
      `${E2E_DEFAULT_GROUP_NAME}`
    );
    cy.get('#name').clear();
    cy.get('#name').type(NEW_GROUP_NAME);
    cy.getByCy('editGroupName').click();
    cy.getByCy('groupName').should('contain', `${NEW_GROUP_NAME}`);
    cy.getByCy('groupSettingsHeader').should('contain', `${NEW_GROUP_NAME}`);
    resetGroupName();
  });
});
