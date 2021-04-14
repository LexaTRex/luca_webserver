import { login } from '../../helpers/functions';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  E2E_LOCATION_GROUP_2,
  E2E_DEFAULT_GROUP_NAME,
  E2E_GROUP_NAME_2,
} from '../../helpers/locations';

describe('Change groups', () => {
  beforeEach(() => login());
  it('can change groups', () => {
    cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
    cy.getByCy('selectGroupDropdown').click();
    cy.getByCy(`groupItem-${E2E_LOCATION_GROUP_2}`).click();
    cy.getByCy('groupName').should('contain', E2E_GROUP_NAME_2);
    cy.getByCy('selectGroupDropdown').click();
    cy.getByCy(`groupItem-${E2E_DEFAULT_LOCATION_GROUP}`).click();
    cy.getByCy('groupName').should('contain', E2E_DEFAULT_GROUP_NAME);
  });
});
