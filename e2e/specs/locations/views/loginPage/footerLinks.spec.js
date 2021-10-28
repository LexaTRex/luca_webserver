/* eslint-disable */
import { LOGIN_ROUTE } from '../../constants/routes';
import { checkLinksInFooter } from '../../ui-helpers/checkLinksInFooter';

describe('Login page has the correct links in the footer', () => {
  beforeEach(() => {
    cy.visit(LOGIN_ROUTE);
  });

  checkLinksInFooter();
});
