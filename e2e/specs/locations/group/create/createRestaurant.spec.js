import { login } from '../../helpers/functions';
import {
  openCreateGroupModal,
  selectGroupType,
  setGroupName,
  setGroupAddress,
  setGroupPhone,
  setGroupTables,
  setGroupRadius,
  setGroupIndoorSelection,
  checkForExistingFields,
  checkForDisabledFields,
  addressFields,
} from '../../helpers/createGroup.helper';

import {
  RESTAURANT_NAME,
  RESTAURANT_ADDRESS,
  RESTAURANT_PHONE,
  RESTAURANT_TABLE_COUNT,
  RESTAURANT_RADIUS,
} from '../../helpers/locations';

describe('Group creation', () => {
  describe('Create Restaurant', () => {
    beforeEach(() => login());
    it('creates group of type restaurant', { retries: 3 }, () => {
      openCreateGroupModal();
      selectGroupType('restaurant');
      setGroupName(RESTAURANT_NAME);
      setGroupAddress(RESTAURANT_ADDRESS);
      checkForExistingFields(addressFields);
      checkForDisabledFields(addressFields);
      // Proceed
      cy.getByCy('proceed').click();
      setGroupPhone(RESTAURANT_PHONE);
      // Proceed by skipping average checkin time
      cy.getByCy('nextStep').click();
      setGroupIndoorSelection();
      setGroupTables(RESTAURANT_TABLE_COUNT);
      setGroupRadius(RESTAURANT_RADIUS);
      // Create group
      cy.getByCy('finishGroupCreation').click();
      // No qr download
      cy.getByCy('no').click();
      // Expect new group to be active
      cy.getByCy('groupName').should('exist');
      cy.getByCy('groupName').contains(RESTAURANT_NAME);
    });
  });
});
