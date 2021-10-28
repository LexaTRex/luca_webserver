/* eslint-disable */
import { REGISTER_ROUTE } from '../../constants/routes';
import { checkLinksInFooter } from '../../ui-helpers/checkLinksInFooter';

describe('Register page has the correct links in the footer', () => {
  beforeEach(() => {
    cy.visit(REGISTER_ROUTE);
  });

  checkLinksInFooter();
});
