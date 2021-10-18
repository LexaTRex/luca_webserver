import { loginLocations } from '../../../utils/auth';
import {
  DEVICE_TYPES,
  traceDataPayload,
  createGroupPayload,
} from '../../../utils/payloads.helper';
import { DELETE_E2E_TRACE_QUERY } from '../../../constants/dbQueries';
import {
  verifyScannerCounter,
  verifyLocationOverview,
} from '../../../ui-helpers/validations';
import { deleteGroup } from '../../../utils/groups';
import { checkin } from '../../../utils/traces';

const CHECKIN_GROUP_NAME = 'neXenio';

describe('Location / Checkin Options / Cam scanner', () => {
  beforeEach(() => {
    //remove trace if exists
    cy.executeQuery(DELETE_E2E_TRACE_QUERY);
    //create a new group with random name
    loginLocations();
    cy.createGroup({ ...createGroupPayload, name: CHECKIN_GROUP_NAME });
  });
  afterEach(() => {
    cy.get('@groupId').then(groupId => {
      deleteGroup(groupId);
    });
    cy.logoutLocations();
  });

  describe('when a user check-in to the location successfully and the location owner clicks on the reload button', () => {
    it('increment the check-in counter', () => {
      verifyLocationOverview();
      //Open QR code reader
      cy.stubNewWindow();
      cy.getByCy('camScanner').click();
      cy.get('video').should('exist').should('be.visible');
      verifyScannerCounter(CHECKIN_GROUP_NAME);
      // Checkin with camera scanner
      cy.get('@scannerId').then(scannerId => {
        checkin({
          ...traceDataPayload,
          scannerId: scannerId,
          deviceType: DEVICE_TYPES.mobile,
        });
        cy.get('span[aria-label=redo]').click();
        cy.contains('1/1');
      });
    });
  });
});
