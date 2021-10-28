/* eslint-disable */
import { loginLocations } from '../../utils/auth';

import {
  openCreateGroupModal,
  selectGroupType,
  setGroupName,
  setGroupArea,
  setGroupPhone,
  setGroupManualAddress,
  checkForExistingFields,
  checkForNonDisabledFields,
  addressFields,
} from '../../ui-helpers/createGroup';

const HOTEL_PHONE = '+4917612345678';

const BASE_NAME = 'Test Group';
const BASE_AREA = 'Some area';

const STREET = 'Charlottenstr. ';
const STREET_NR = '59';
const ZIP = '10117';
const STATE = 'Berlin';

describe('Group creation with manuell input', () => {
  beforeEach(() => loginLocations());
  it('creates group of type base', () => {
    openCreateGroupModal();
    selectGroupType('base');
    setGroupName(BASE_NAME);
    // Decline Google API
    cy.getByCy('no').click();
    checkForExistingFields(addressFields);
    checkForNonDisabledFields(addressFields);
    setGroupManualAddress(STREET, STREET_NR, ZIP, STATE);
    setGroupPhone(HOTEL_PHONE);
    // Proceed by skipping average checkin time
    cy.getByCy('nextStep').click();
    setGroupArea(BASE_AREA);
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
