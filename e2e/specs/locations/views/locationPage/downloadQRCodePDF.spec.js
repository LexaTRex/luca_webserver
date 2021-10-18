import { loginLocations } from '../../utils/auth';

import {
  openCreateGroupModal,
  selectGroupType,
  setGroupName,
  setGroupAddress,
  setGroupPhone,
  setGroupIndoorSelection,
} from '../../ui-helpers/createGroup';

import {
  RESTAURANT_ADDRESS,
  RESTAURANT_NAME,
  RESTAURANT_PHONE,
  E2E_DEFAULT_LOCATION_GROUP,
  NEW_RESTAURANT_LOCATION,
  RESTAURANT_TYPE,
} from '../../constants/locations';

import { removeLocation } from '../../utils/locations';

describe('Download QR Codes PDF', { retries: 3 }, () => {
  beforeEach(() => loginLocations());
  after(() => removeLocation(NEW_RESTAURANT_LOCATION));

  describe('On Group creation', () => {
    it('downloads the Group PDF', () => {
      openCreateGroupModal();
      selectGroupType('restaurant');
      setGroupName(RESTAURANT_NAME);
      setGroupAddress(RESTAURANT_ADDRESS);
      // Proceed
      cy.getByCy('proceed').click();
      setGroupPhone(RESTAURANT_PHONE);
      // Proceed by skipping average checkin time
      cy.getByCy('nextStep').click();
      setGroupIndoorSelection();
      cy.getByCy('no').click();
      cy.getByCy('no').click();
      cy.getByCy('finishGroupCreation').click();
      cy.getByCy('yes').click();
      cy.getByCy('download').click();
      cy.get('.ant-message-notice').should('exist');
      cy.get('.ant-message-notice', { timeout: 20000 }).should('not.exist');
      cy.readFile('./downloads/luca_QRCode_Test_Restaurant.pdf', {
        timeout: 30000,
      });
      cy.task(
        'deleteFileIfExists',
        './downloads/luca_QRCode_Test_Restaurant.pdf'
      );
    });
  });

  describe('On Location creation', () => {
    it('downloads the Locations PDF', () => {
      cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
      cy.getByCy(RESTAURANT_TYPE).click();
      cy.get('#locationName').type(NEW_RESTAURANT_LOCATION);
      cy.getByCy('nextStep').click();
      cy.getByCy('yes').click();
      cy.get('#phone').type(RESTAURANT_PHONE);
      cy.getByCy('nextStep').click();
      cy.getByCy('nextStep').click();
      cy.getByCy('indoorSelection').click();
      cy.getByCy('selectIndoor').click();
      cy.get('button[type=submit]').click();
      cy.getByCy('no').click();
      cy.getByCy('no').click();
      cy.getByCy('done').click();
      cy.getByCy('yes').click();
      cy.getByCy('qrCodeDownload').click();
      cy.get('.ant-message-notice', { timeout: 20000 }).should('not.exist');
      cy.readFile(
        './downloads/luca_QRCode_Nexenio_1_e2e_NEW_RESTAURANT_LOCATION.pdf'
      );
      cy.task(
        'deleteFileIfExists',
        './downloads/luca_QRCode_Nexenio_1_e2e_NEW_RESTAURANT_LOCATION.pdf'
      );
    });
  });

  describe('On Location page', () => {
    it('downloads the Tables PDF', { retries: 2 }, () => {
      cy.getByCy('location-NEW_RESTAURANT_LOCATION').click();
      cy.getByCy('locationCard-tableSubdivision').click();
      cy.getByCy('activateTableSubdivision').click();
      cy.getByCy('locationCard-generateQRCodes').click();
      cy.getByCy('qrCodeDownload').click();
      cy.get('.ant-message-notice', { timeout: 60000 }).should('not.exist');
      cy.readFile(
        './downloads/luca_QRCodes_Nexenio_1_e2e_NEW_RESTAURANT_LOCATION_Tables.pdf'
      );
      cy.task(
        'deleteFileIfExists',
        './downloads/luca_QRCodes_Nexenio_1_e2e_NEW_RESTAURANT_LOCATION_Tables.pdf'
      );
    });

    it('downloads the Location PDF if tables are configured', () => {
      cy.getByCy('location-NEW_RESTAURANT_LOCATION').click();
      cy.getByCy('locationCard-tableSubdivision').click();
      cy.getByCy('activateTableSubdivision').then(element => {
        if (element[0].ariaChecked === 'false') {
          element.click();
        }
      });
      cy.getByCy('locationCard-generateQRCodes').click();
      cy.getByCy('toggleAreaQRCodes').click();
      cy.getByCy('qrCodeDownload').click();
      cy.get('.ant-message-notice', { timeout: 20000 }).should('not.exist');
      cy.readFile(
        './downloads/luca_QRCode_Nexenio_1_e2e_NEW_RESTAURANT_LOCATION.pdf',
        { timeout: 20000 }
      );
      cy.task(
        'deleteFileIfExists',
        './downloads/luca_QRCode_Nexenio_1_e2e_NEW_RESTAURANT_LOCATION.pdf'
      );
    });
  });
});
