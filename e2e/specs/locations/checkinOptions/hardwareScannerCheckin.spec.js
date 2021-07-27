import { DELETE_E2E_TRACE_QUERY } from '../helpers/dbQueries.js';
import { verifyLocationOverview, verifyScannerCounter } from '../helpers/inputValidation.helper';
import { traceDataPayload, createGroupPayload, DEVICE_TYPES } from '../helpers/functions.helper';
import { login, logout, contactFormCheckin, createGroup, deleteGroup } from '../helpers/functions';

const CHECKIN_GROUP_NAME = 'neXenio';

describe('Location / Checkin Options / hardware scanner', () => {
  beforeEach(() => {
    //remove trace if exists
    cy.executeQuery(DELETE_E2E_TRACE_QUERY);
    login();
    createGroup({ ...createGroupPayload, name: CHECKIN_GROUP_NAME });
  });
  afterEach(() => {
    cy.get('@groupId').then(groupId => {
      deleteGroup(groupId);
    });
    logout();
  });

  describe('when a user check-in to the location successfully and the location owner clicks on the reload button', () => {
    it('increment the check-in counter', () => {
      verifyLocationOverview();
      //Open QR code reader tool
      cy.stubNewWindow();
      cy.getByCy('scanner').click();
      verifyScannerCounter(CHECKIN_GROUP_NAME);
      // Checkin with scanner tool
      cy.get('@scannerId').then(scannerId => {
        contactFormCheckin({ ...traceDataPayload, scannerId: scannerId, deviceType: DEVICE_TYPES.scanner });
        cy.get('span[aria-label=redo]').click();
        cy.contains('1/1');
      });
    });
  });
});
