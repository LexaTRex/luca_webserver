import { contactFormCheckin, login } from '../helpers/functions';
import { traceDataPayload } from '../helpers/functions.helper';

const checkTrackingTime = x => {
  const filtered = x.split(' - ').filter(el => el !== '');
  return filtered.length;
};

describe('Location overview', () => {
  beforeEach(() => login());

  it('has no checked-in guests by default', () => {
    cy.getByCy('guestCount').should('contain', 0);
    cy.getByCy('showGuestList').click({ force: true });
    cy.getByCy('totalCheckinCount').should('contain', 0);
  });

  it('changes the guest count and the tracking time by checking in and checking out a guest', () => {
    // Check in a guest
    contactFormCheckin(traceDataPayload);
    // Expect the guest count to be 1
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
    cy.getByCy('trackingTime').should('exist');
    cy.getByCy('trackingTime').then(el => {
      expect(checkTrackingTime(el.text())).to.equal(2);
    });
  });
});
