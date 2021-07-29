import { checkin, login } from '../helpers/functions';
import { traceDataPayload, DEVICE_TYPES } from '../helpers/functions.helper';
import { DELETE_E2E_TRACE_QUERY } from '../helpers/dbQueries';
import { E2E_DEFAULT_LOCATION_FORM } from '../helpers/locations';

const checkTrackingTime = x => {
  const filtered = x.split(' - ').filter(el => el !== '');
  return filtered.length;
};

describe('Locations / Location overview', () => {
  before(() => cy.executeQuery(DELETE_E2E_TRACE_QUERY));
  beforeEach(() => login());

  describe('when view new location', () => {
    it('no checked-in guests is displayed by default', () => {
      cy.getByCy('guestCount').should('contain', 0);
      cy.getByCy('showGuestList').click({ force: true });
      cy.getByCy('totalCheckinCount').should('contain', 0);
    });
  });

  describe('when check-in/check-out location', () => {
    it('guest count and the tracking time is changed', () => {
      // Check in a guest
      checkin({ ...traceDataPayload, deviceType: DEVICE_TYPES.mobile });
      // Expect the guest count to be 1
      cy.getByCy('guestCount').next().should('be.visible').click();
      cy.getByCy('guestCount').should('contain', 1);
      // Expect the total checkin count to be 1 within the guest list modal
      cy.getByCy('showGuestList').click({ force: true });
      cy.getByCy('totalCheckinCount').contains(1);
      cy.getByCy('trackingTime').then(el => {
        expect(checkTrackingTime(el.text())).to.equal(1);
      });
      cy.get('.ant-modal-close-x').click();

      // Check out the guest
      cy.getByCy('checkoutGuest').click();
      cy.get('.ant-popover-buttons .ant-btn-primary').click();
      cy.get('.successCheckout').should('exist');
      // Expect the total checkin count to be 1 in the guest list modal
      cy.getByCy('showGuestList').click({ force: true });
      cy.getByCy('totalCheckinCount').should('exist').and('contain', 1);
      // Expect the both checkin and checkout time exist in the guest list modal
      cy.getByCy('showGuestList').click({ force: true });
      cy.getByCy('trackingTime').then(el => {
        setTimeout(
          () => expect(checkTrackingTime(el.text())).to.equal(2),
          3000
        );
      });
    });
  });
});
