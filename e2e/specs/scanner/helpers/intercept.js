import { SCANNER_ROUTE } from './routes';

export const interceptBloomFilterCall = () =>
  cy.intercept({
    method: 'GET',
    url: 'https://localhost/api/v3/badges/bloomFilter',
  });

export const visitScanner = () => cy.visit(SCANNER_ROUTE);

export const visitScannerAndWaitForFilterLoad = () => {
  interceptBloomFilterCall().as('getBloomFilter');
  visitScanner();
  cy.wait('@getBloomFilter');
};
