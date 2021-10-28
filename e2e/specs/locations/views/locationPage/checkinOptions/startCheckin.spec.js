/* eslint-disable */
import { loginLocations } from '../../../utils/auth';
import {
  E2E_DEFAULT_CONTACT_FORM_LINK,
  E2E_DEFAULT_SCANNER_LINK,
  E2E_DEFAULT_CAM_SCANNER_LINK,
} from '../../../constants/locations';

describe('Start scanner', () => {
  beforeEach(() => loginLocations());
  it('opens the contact form', () => {
    cy.window().then(win => {
      cy.stub(win, 'open', () => {
        win.location.href = E2E_DEFAULT_CONTACT_FORM_LINK;
      }).as('contactForm');
    });
    cy.getByCy('contactForm').click();
    cy.get('@contactForm').should('be.called');
  });
  it('opens the hardwarescanner', () => {
    cy.window().then(win => {
      cy.stub(win, 'open', () => {
        win.location.href = E2E_DEFAULT_SCANNER_LINK;
      }).as('scanner');
    });
    cy.getByCy('scanner').click();
    cy.get('@scanner').should('be.called');
  });
  it('opens the cam scanner', () => {
    cy.window().then(win => {
      cy.stub(win, 'open', () => {
        win.location.href = E2E_DEFAULT_CAM_SCANNER_LINK;
      }).as('camScanner');
    });
    cy.getByCy('camScanner').click();
    cy.get('@camScanner').should('be.called');
  });
});
