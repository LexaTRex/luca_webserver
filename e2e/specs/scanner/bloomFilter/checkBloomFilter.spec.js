/* eslint-disable */
import {
  DELETED_REGISTERED_BADGE,
  REGISTERED_BADGE,
  UNREGISTERED_BADGE,
} from '../helpers/badges';
import { inputQRCodeData } from '../helpers/input';
import { regenerateBloomFilter } from '../helpers/api';
import {
  visitScannerAndWaitForFilterLoad,
  visitScanner,
} from '../helpers/intercept';

describe('Check bloom filter for unregistered and deleted badges', () => {
  it('can check in a registered badge', () => {
    regenerateBloomFilter();
    visitScannerAndWaitForFilterLoad();
    inputQRCodeData(REGISTERED_BADGE);
    cy.getByCy('badgeCheckInSuccess').should('exist');
  });

  it('cannot check in a unregistered badge', () => {
    visitScanner();
    inputQRCodeData(UNREGISTERED_BADGE);
    cy.get('.noBadgeUserDataError').should('exist');
  });

  it('cannot check in a deleted registered badge', () => {
    visitScanner();
    inputQRCodeData(DELETED_REGISTERED_BADGE);
    cy.get('.noBadgeUserDataError').should('exist');
  });
});
