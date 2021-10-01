import { login } from '../../helpers/functions';

import {
  openCreateGroupModal,
  selectGroupType,
  setGroupName,
  setGroupAddress,
  setGroupPhone,
  setGroupArea,
  setGroupRadius,
  checkForExistingFields,
  checkForDisabledFields,
  addressFields,
} from '../../helpers/createGroup.helper';

const HOTEL_NAME = 'Test Hotel';
const HOTEL_ADDRESS = 'Nexenio';
const HOTEL_PHONE = '+4917612345678';
const HOTEL_AREA = 'Restaurant';
const HOTEL_RADIUS = '100';

const BASE_NAME = 'Test Group';
const BASE_AREA = 'Some area';

describe('Group creation', () => {
  beforeEach(() => login());
  describe('Create hotel or base type', () => {
    it('creates group of type hotel', { retries: 3 }, () => {
      openCreateGroupModal();
      selectGroupType('hotel');
      setGroupName(HOTEL_NAME);
      setGroupAddress(HOTEL_ADDRESS);
      checkForExistingFields(addressFields);
      checkForDisabledFields(addressFields);
      // Proceed
      cy.getByCy('proceed').click();
      setGroupPhone(HOTEL_PHONE);
      // Proceed by skipping average checkin time
      cy.getByCy('nextStep').click();
      setGroupArea(HOTEL_AREA);
      setGroupRadius(HOTEL_RADIUS);
      // Create group
      cy.getByCy('finishGroupCreation').click();
      // No qr download
      cy.getByCy('no').click();
      // Expect new group to be active
      cy.getByCy('groupName').should('exist');
      cy.getByCy('groupName').contains(HOTEL_NAME);
      // Expect hotel area to be in the list
      cy.contains('#groupList', HOTEL_AREA);
    });
    it('creates group of type base', { retries: 3 }, () => {
      openCreateGroupModal();
      selectGroupType('base');
      setGroupName(BASE_NAME);
      setGroupAddress(HOTEL_ADDRESS);
      checkForExistingFields(addressFields);
      checkForDisabledFields(addressFields);
      // Proceed
      cy.getByCy('proceed').click();
      setGroupPhone(HOTEL_PHONE);
      // Proceed by skipping average checkin time
      cy.getByCy('nextStep').click();
      setGroupArea(BASE_AREA);
      setGroupRadius(HOTEL_RADIUS);
      // Create group
      cy.getByCy('finishGroupCreation').click();
      // No qr download
      cy.getByCy('no').click();
      // Expect new group to be active
      cy.getByCy('groupName').should('exist');
      cy.getByCy('groupName').contains(BASE_NAME);
      // Expect hotel area to be in the list
      cy.contains('#groupList', BASE_AREA);
    });
  });
});
