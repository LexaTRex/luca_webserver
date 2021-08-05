import {
  E2E_DEFAULT_LOCATION_NAME,
  E2E_SECOND_LOCATION_NAME,
} from '../helpers/locations';

const TIME_REGEXP = /^\d{2}:\d{2}$/;

export const checkRadiusInput = () => {
  // Invalid radius input (empty, under 50 or over 5000):
  cy.get('#radius').clear();
  cy.get('.ant-form-item-explain-error').should('exist');
  cy.get('#radius').clear().type(10);
  cy.get('.ant-form-item-explain-error').should('exist');
  cy.get('#radius').clear().type(5050);
  cy.get('.ant-form-item-explain-error').should('exist');
};

export const checkRadiusInputEdgeCase = () => {
  cy.get('#radius').clear().type('#%?@@');
  cy.get('.ant-form-item-explain-error').should('exist');
  cy.get('#radius').clear().type('testing');
  cy.get('.ant-form-item-explain-error').should('exist');
};

export const verifyLocationOverview = () => {
  cy.getByCy('camScanner').should('exist').should('be.visible');
  cy.getByCy('scanner').should('exist').should('be.visible');
  cy.getByCy('contactForm').should('exist').should('be.visible');
  cy.getByCy('guestCount').should('exist').should('be.visible');
  cy.getByCy('showGuestList').should('exist').should('be.visible');
  cy.getByCy('checkoutGuest').should('exist').should('be.visible').should('have.attr', 'disabled');
};

export const verifyScannerCounter = (groupName) => {
  cy.contains(groupName);
  cy.contains('0/0');
  cy.get('span[aria-label=redo]').should('exist').should('be.visible');
};

export const defaultLocationNameShouldBeRejected = () => {
  cy.get('#locationName').type(E2E_DEFAULT_LOCATION_NAME);
  cy.getByCy('nextStep').click();
  cy.get('.ant-form-item-explain-error').should('exist');
};

export const checkLocationNameIsUnique = () => {
  cy.get('#locationName').type(E2E_SECOND_LOCATION_NAME);
  cy.getByCy('nextStep').click();
  cy.get('.ant-form-item-explain-error').should('exist');
};

export const verifyLocationHomePage = () => {
  cy.get('section > aside').should('be.visible').should('exist');
  cy.get('section > main').should('be.visible').should('exist');
};

export const verifyModalWindowIsClosed = () => {
  cy.get('#root').within(($root) => {
    expect($root.find('.ant-modal-content').length).to.equal(0);
  });
};

export const verifyGuestsCount = (count) => {
  cy.getByCy('guestCount').next().click();
  cy.getByCy('guestCount').should('contain', count);
};

export const verifyCheckinGuestTime = (date) => {
  cy.get('.ant-modal-content').should('be.visible').within(() => {
    cy.getByCy('checkinDate').should('have.text', date);
    cy.getByCy('checkinTime').contains(TIME_REGEXP);
    cy.getByCy('checkoutDate').should('have.text', '-');
    cy.getByCy('checkoutTime').contains('-');
  });
};

export const verifyCheckoutGuestTime = (date) => {
  cy.get('.ant-modal-content').should('be.visible').within(() => {
    cy.getByCy('checkinDate').should('have.text', date);
    cy.getByCy('checkinTime').contains(TIME_REGEXP);
    cy.getByCy('checkoutDate').should('have.text', date);
    cy.getByCy('checkoutTime').contains(TIME_REGEXP);
  });
};
