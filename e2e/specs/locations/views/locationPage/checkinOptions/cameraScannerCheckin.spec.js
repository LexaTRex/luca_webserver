/* eslint-disable */
import {
  DYNAMIC_DEVICE_TYPES,
  dynamicTraceDataPayload,
} from '../../../utils/payloads.helper';
import {
  verifyScannerCounter,
  verifyLocationOverview,
} from '../../../ui-helpers/validations';
import { dynamicCheckin } from '../../../utils/traces';
import {
  CHECKIN_GROUP_NAME,
  checkinSetup,
  removeGroup,
} from './checkin.helper';

describe('Location / Checkin Options / Cam scanner', () => {
  beforeEach(() => {
    checkinSetup();
  });
  afterEach(() => {
    removeGroup();
  });

  describe('when a user check-in to the location successfully and the location owner clicks on the reload button', () => {
    it('increment the check-in counter', () => {
      verifyLocationOverview();
      // Open QR code reader
      cy.stubNewWindow();
      cy.getByCy('camScanner').click();
      cy.get('video').should('exist').should('be.visible');
      verifyScannerCounter(CHECKIN_GROUP_NAME);
      // Checkin with camera scanner
      cy.get('@scannerId').then(scannerId => {
        dynamicCheckin({
          ...dynamicTraceDataPayload,
          scannerId,
          deviceType: DYNAMIC_DEVICE_TYPES.DEVICE_TYPE_WEBAPP,
        });
        cy.get('span[aria-label=redo]').click();
        cy.contains('1/1');
      });
    });
  });
});
