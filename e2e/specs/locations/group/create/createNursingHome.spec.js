import { login } from '../../helpers/functions';

import {
  openCreateGroupModal,
  selectGroupType,
  setGroupName,
  setGroupAddress,
  setGroupPhone,
  setGroupRadius,
  checkForExistingFields,
  checkForDisabledFields,
  addressFields,
} from '../../helpers/createGroup.helper';

const NURSING_HOME_NAME = 'Test Nursing Home';
const NURSING_HOME_ADDRESS = 'Nexenio';
const NURSING_HOME_PHONE = '+4917612345678';
const NURSING_HOME_RADIUS = '100';
describe('Group creation', () => {
  beforeEach(() => login());
  describe('Create Nursing Home', () => {
    it('creates group of type nursing_home', { retries: 3 }, () => {
      openCreateGroupModal();
      selectGroupType('nursing_home');
      setGroupName(NURSING_HOME_NAME);
      setGroupAddress(NURSING_HOME_ADDRESS);
      checkForExistingFields(addressFields);
      checkForDisabledFields(addressFields);
      // Proceed
      cy.getByCy('proceed').click();
      setGroupPhone(NURSING_HOME_PHONE);
      // Proceed by skipping average checkin time
      cy.getByCy('nextStep').click();
      // Select post checkin questions
      cy.getByCy('yes').click();
      setGroupRadius(NURSING_HOME_RADIUS);
      // Create group
      cy.getByCy('finishGroupCreation').click();
      // No qr download
      cy.getByCy('no').click();
      // Expect new group to be active
      cy.getByCy('groupName').should('exist');
      cy.getByCy('groupName').contains(NURSING_HOME_NAME);
    });
  });
});
