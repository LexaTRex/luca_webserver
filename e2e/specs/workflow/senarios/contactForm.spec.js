/* eslint-disable */
import moment from 'moment';

import { fillForm } from '../../contact-form/helpers/functions';
import { removeHDPrivateKeyFile } from '../helpers/functions';
import { loginHealthDepartment } from '../../health-department/helper/api/auth.helper';
import { signHealthDepartment } from '../../health-department/helper/signHealthDepartment';
import {
  setDatePickerStartDate,
  setDatePickerEndDate,
} from '../../health-department/helper/ui/tracking.helper';

import { createGroupPayload } from '../../locations/utils/payloads.helper';
import {
  E2E_COMPLETE_EMAIL,
  E2E_COMPLETE_PASSWORD,
  WORKFLOW_LOCATION_PRIVATE_KEY_NAME,
  WORKFLOW_LOCATION_PRIVATE_KEY_PATH,
} from '../helpers/users';
import { APP_ROUTE } from '../../locations/constants/routes';
import {
  downloadLocationPrivateKeyFile,
  uploadLocationPrivateKeyFile,
} from '../../locations/ui-helpers/handlePrivateKeyFile';
import { addHealthDepartmentPrivateKeyFile } from '../../health-department/helper/ui/handlePrivateKeyFile';

const FORM_WORKFLOW_TESTING_GROUP_NAME = 'Form Workflow';
const yesterdayDate = moment().subtract(1, 'days').format('DD.MM.YYYY');
const tomorrowDate = moment().add(1, 'days').format('DD.MM.YYYY');

context('Workflow', () => {
  describe('when the Luca workflow will checked with contact form data', () => {
    it('decrypt all data successfully', () => {
      // CLEAN UP
      cy.log('Cleanup for Workflow');
      removeHDPrivateKeyFile();

      // SETUP Health department
      cy.log('Setup Health department');
      loginHealthDepartment();
      signHealthDepartment();
      addHealthDepartmentPrivateKeyFile();
      // We need to wait for the key rotation logic
      cy.wait(1000);
      cy.logoutHD();

      // SETUP Location
      cy.log('Setup Location');
      cy.basicLoginLocations(E2E_COMPLETE_EMAIL, E2E_COMPLETE_PASSWORD);
      cy.visit(APP_ROUTE);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(800);
      downloadLocationPrivateKeyFile();
      uploadLocationPrivateKeyFile(
        WORKFLOW_LOCATION_PRIVATE_KEY_PATH,
        WORKFLOW_LOCATION_PRIVATE_KEY_NAME
      );
      cy.getByCy('complete', { timeout: 1000 }).click();
      cy.get('.ant-modal-body').should('not.exist');
      cy.createGroup({
        ...createGroupPayload,
        name: FORM_WORKFLOW_TESTING_GROUP_NAME,
      });

      // Checkin with contact form
      cy.log('Checkin with in testing Location with Contact Form');
      cy.stubNewWindow();
      cy.getByCy('contactForm').click();
      const users = [];
      for (let index = 0; index < 2; index += 1) {
        users.push(fillForm());
      }
      cy.logoutLocations();

      // Request data from testing Location
      cy.log('Request data from testing Location');
      loginHealthDepartment();
      addHealthDepartmentPrivateKeyFile();
      cy.getByCy('searchGroup').click();
      cy.get('.ant-modal').should('exist');
      cy.getByCy('groupNameInput').type(FORM_WORKFLOW_TESTING_GROUP_NAME);
      cy.getByCy('startGroupSearch').click();
      cy.getByCy(`group_${FORM_WORKFLOW_TESTING_GROUP_NAME}`).click();
      setDatePickerStartDate(yesterdayDate);
      setDatePickerEndDate(tomorrowDate);

      cy.getByCy('requestGroupData').click();
      cy.getByCy('processEntry').should('exist');
      cy.getByCy('processEntry').first().click();

      cy.getByCy(`contactLocation_${FORM_WORKFLOW_TESTING_GROUP_NAME}`)
        .first()
        .click();

      cy.get('.ant-popover-buttons button').should('exist');
      cy.get('.ant-popover-buttons button')
        .eq(1)
        .then($element => {
          cy.wrap($element).contains('Request data').click();
          cy.logoutHD();

          // Share testing data from testing Location
          cy.log('Share testing data from testing Location');
          cy.basicLoginLocations(E2E_COMPLETE_EMAIL, E2E_COMPLETE_PASSWORD);
          cy.visit(APP_ROUTE, {
            onBeforeLoad: win => {
              win.sessionStorage.clear();
            },
          });
          uploadLocationPrivateKeyFile(
            WORKFLOW_LOCATION_PRIVATE_KEY_PATH,
            WORKFLOW_LOCATION_PRIVATE_KEY_NAME
          );
          cy.getByCy('dataRequests').click();
          cy.stubNewWindow();
          cy.getByCy('completeDataTransfer').first().click();
          cy.getByCy('next').click();

          // Check requested data in Health department
          cy.log('Check requested data in Health department');
          loginHealthDepartment();
          addHealthDepartmentPrivateKeyFile();
          cy.getByCy('processEntry').should('exist');
          cy.getByCy('processEntry').first().click();
          cy.getByCy(`confirmedLocation_${FORM_WORKFLOW_TESTING_GROUP_NAME}`)
            .first()
            .click();
          cy.get('.ant-modal').should('exist');

          for (const user of users) {
            cy.get('#contactPersonsTable').contains(user.lastName);
            cy.get('#contactPersonsTable').contains(user.firstName);
            cy.get('#contactPersonsTable').contains(user.phoneNumber);
          }
        });
    });
  });
});
