import moment from 'moment';
import { loginHealthDepartment } from '../../helper/api/auth.helper';
import { addHealthDepartmentPrivateKeyFile } from '../../helper/ui/login.helper';
import {
  setDatePickerStartDate,
  setDatePickerEndDate,
} from '../../helper/ui/tracking.helper';
import { E2E_DEFAULT_GROUP_NAME } from '../../../locations/constants/locations';

const GROUP_PREFIX = 'group_';
const YESTERDAY = moment().subtract(1, 'days').format('DD.MM.YYYY');
const TODAY = moment().format('DD.MM.YYYY');

describe('Health Department / Tracking / Location tracking', () => {
  describe('when close tracking process', () => {
    it('the process disappears from the list', () => {
      loginHealthDepartment();
      addHealthDepartmentPrivateKeyFile();
      //search E2E group
      cy.getByCy('searchGroup').should('exist').should('be.visible').click();
      cy.getByCy('groupNameInput')
        .should('exist')
        .should('be.visible')
        .type(E2E_DEFAULT_GROUP_NAME);
      cy.getByCy('startGroupSearch')
        .should('exist')
        .should('be.visible')
        .click();
      cy.getByCy(GROUP_PREFIX + E2E_DEFAULT_GROUP_NAME)
        .should('exist')
        .should('be.visible')
        .click();
      //set tracking dates
      setDatePickerStartDate(YESTERDAY);
      setDatePickerEndDate(TODAY);
      //open tracking process
      cy.getByCy('requestGroupData').click();
      cy.getByCy('processEntry')
        .should('exist')
        .and('contain', E2E_DEFAULT_GROUP_NAME)
        .first()
        .click();
      //close tracking process
      cy.getByCy('complete').should('exist').click();
      cy.get('.ant-popover-inner-content').within($popup => {
        cy.get('.ant-btn-primary').should('exist').click();
      });
      //verify process is not in the list
      cy.getByCy('emptyProcesses').should('exist').should('be.visible');
    });
  });
});
