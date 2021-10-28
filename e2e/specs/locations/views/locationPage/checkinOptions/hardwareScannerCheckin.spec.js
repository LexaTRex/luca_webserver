/* eslint-disable */
import {
  verifyScannerCounter,
  verifyLocationOverview,
} from '../../../ui-helpers/validations';
import {
  DYNAMIC_DEVICE_TYPES,
  dynamicTraceDataPayload,
} from '../../../utils/payloads.helper';
import { dynamicCheckin } from '../../../utils/traces';
import {
  CHECKIN_GROUP_NAME,
  checkinSetup,
  removeGroup,
} from './checkin.helper';

describe('Location / Checkin Options / hardware scanner', () => {
  beforeEach(() => {
    checkinSetup();
  });
  afterEach(() => {
    removeGroup();
  });

  describe('when a user check-in to the location successfully and the location owner clicks on the reload button', () => {
    it('increment the check-in counter', () => {
      verifyLocationOverview();
      // Open QR code reader tool
      cy.stubNewWindow();
      cy.getByCy('scanner').click();
      verifyScannerCounter(CHECKIN_GROUP_NAME);
      // Checkin with scanner tool
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
