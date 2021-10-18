import moment from 'moment';

import { DELETE_E2E_TRACE_QUERY } from '../../constants/dbQueries';
import { loginLocations } from '../../utils/auth';
import { traceDataPayload, DEVICE_TYPES } from '../../utils/payloads.helper';
import {
  verifyCheckinGuestTime,
  verifyCheckoutGuestTime,
  verifyGuestsCount,
} from '../../ui-helpers/validations';
import { checkoutGuests } from '../../ui-helpers/locationOverview';
import { checkin } from '../../utils/traces';

const CURRENT_DATE = moment().format('DD.MM.YYYY');

describe('Locations / Location overview', () => {
  beforeEach(() => {
    cy.executeQuery(DELETE_E2E_TRACE_QUERY);
    loginLocations();
  });

  describe('when view new location', () => {
    it('no checked-in guests is displayed by default', () => {
      verifyGuestsCount(0);
      cy.getByCy('showGuestList').click();
      cy.getByCy('totalCheckinCount').should('contain', 0);
    });
  });

  describe('when check-in/check-out location with contact form', () => {
    it('guest count and the tracking time are changed', () => {
      // Check in a guest
      checkin({ ...traceDataPayload, deviceType: DEVICE_TYPES.mobile });
      // Expect the guest count to be 1
      verifyGuestsCount(1);
      // Expect the total checkin count to be 1 within the guest list modal
      cy.getByCy('showGuestList').click();
      cy.getByCy('totalCheckinCount').should('exist').and('contain', 1);
      verifyCheckinGuestTime(CURRENT_DATE);
      cy.get('.ant-modal-close-x').click();
      // Check out the guest
      checkoutGuests();
      // Expect the total checkin count to be 1 in the guest list modal
      cy.getByCy('showGuestList').click();
      verifyCheckoutGuestTime(CURRENT_DATE);
    });
  });

  describe('when check-in/check-out location with camera scanner', () => {
    it('guest count and the tracking time are changed', () => {
      // Check in a guest
      checkin({ ...traceDataPayload, deviceType: DEVICE_TYPES.mobile });
      // Expect the guest count to be 1
      verifyGuestsCount(1);
      // Expect the total checkin count to be 1 within the guest list modal
      cy.getByCy('showGuestList').click();
      cy.getByCy('totalCheckinCount').should('exist').and('contain', 1);
      verifyCheckinGuestTime(CURRENT_DATE);
      cy.get('.ant-modal-close-x').click();
      // Check out the guest
      checkoutGuests();
      // Expect the total checkin count to be 1 in the guest list modal
      cy.getByCy('showGuestList').click();
      verifyCheckoutGuestTime(CURRENT_DATE);
    });
  });
});
