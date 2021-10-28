/* eslint-disable */
import { loginLocations } from '../../utils/auth';
import {
  PROFILE_ROUTE,
  APP_ROUTE,
  DATA_TRANSFERS_ROUTE,
} from '../../constants/routes';
import { E2E_EMAIL, E2E_PASSWORD } from '../../constants/users';
import {
  requestAccountDeletion,
  undoAccountDeletion,
} from '../../utils/operators';

describe('an active account', () => {
  beforeEach(() => {
    loginLocations(E2E_EMAIL, E2E_PASSWORD, PROFILE_ROUTE);
    undoAccountDeletion();
  });

  it('can be deactivated', () => {
    cy.getByCy('deleteAccountSection').within(() => {
      cy.getByCy('deleteAccount').click();
    });
    cy.get('.ant-popover-content').find('.ant-btn-primary').click();

    cy.get('.ant-message-notice').find('.ant-message-success');
  });
});

describe('a deactivated account', () => {
  beforeEach(() => {
    cy.basicLoginLocations();
    requestAccountDeletion();
  });

  it("doesn't show a delete button", () => {
    cy.visit(PROFILE_ROUTE);
    cy.getByCy('deleteAccount').should('not.exist');
  });

  it('still shows relevant profile content', () => {
    cy.visit(PROFILE_ROUTE);
    cy.getByCy('groupsOverview');
    cy.getByCy('privacyLinkMandatory');
    cy.getByCy('privacyLinkOptional');
    cy.getByCy('dpaLink');
    cy.getByCy('tomsLink');
  });

  it('shows deletion in progress', () => {
    cy.visit(PROFILE_ROUTE);
    cy.getByCy('deleteAccountSection').within(() => {
      cy.getByCy('inProgress');
      cy.contains('27'); // days remaining
    });
  });

  it('shows a notice on the main route', () => {
    cy.visit(APP_ROUTE);
    cy.getByCy('deletionRequested');
    cy.get('button').should('have.attr', 'data-cy', 'restoreAccount');
  });

  it('still shows data requests', () => {
    cy.visit(DATA_TRANSFERS_ROUTE);
    cy.getByCy('dataTransfers');
  });

  context('when reactivating', () => {
    beforeEach(() => {
      cy.visit(PROFILE_ROUTE);
      cy.getByCy('restoreAccount').click();
    });

    it('shows a success message', () => {
      cy.get('.ant-message-notice').find('.ant-message-success');
    });

    it('shows the deletion button again', () => {
      cy.getByCy('deleteAccountSection').within(() => {
        cy.getByCy('deleteAccount').should('exist');
      });
    });

    it('shows location and groups again', () => {
      cy.visit(APP_ROUTE);
      cy.getByCy('locationDisplayName');
      cy.getByCy('location-General');
    });
  });
});
