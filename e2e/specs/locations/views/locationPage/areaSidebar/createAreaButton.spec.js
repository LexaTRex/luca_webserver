/* eslint-disable */
import { loginLocations } from '../../../utils/auth';
import { APP_ROUTE } from '../../../constants/routes';
import { E2E_DEFAULT_LOCATION_GROUP } from '../../../constants/locations';

describe('Location overview area sidebar plus button', () => {
  beforeEach(() => loginLocations());
  it('opens the modal to create a new location area', () => {
    cy.url().should('include', APP_ROUTE);
    cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
    cy.get('.ant-modal-content').should('be.visible');
    cy.getByCy('createAreaModalHeader').should('be.visible');
    cy.getByCy('createAreaModalDescription').should('be.visible');
    cy.get('.ant-modal-close-x').click();
    cy.get('.ant-modal-content').should('not.exist');
  });
});
