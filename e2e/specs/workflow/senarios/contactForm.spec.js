import moment from 'moment';

import { fillForm } from '../../contact-form/helpers/functions';

import {
  downloadHealthDepartmentPrivateKey,
  uploadHealthDepartmentPrivateKeyFile,
  loginHealthDepartment,
} from '../../health-department/helper/functions';

import { APP_ROUTE } from '../../locations/helpers/routes';
import { createGroupPayload } from '../../locations/helpers/functions.helper';
import {
  basicLocationLogin,
  createGroup,
  downloadLocationPrivateKeyFile,
  uploadLocationPrivateKeyFile,
  logout,
} from '../../locations/helpers/functions';

import { clean } from '../helpers/functions';
import { E2E_COMPLETE_EMAIL, E2E_COMPLETE_PASSWORD } from '../helpers/users';

const FORM_WORKFLOW_TESTING_GROUP_NAME = 'Form Workflow';

const yesterday = moment().subtract(1, 'days').format('DD.MM.YYYY hh:mm');
const tomorrow = moment().add(1, 'days').format('DD.MM.YYYY hh:mm');

context('Workflow', () => {
  describe('when the Luca workflow will checked with contact form data', () => {
    it('decrypt all data successfully', () => {
      // CLEAN UP
      cy.log('Cleanup for Workflow');
      clean();

      // SETUP Health department
      cy.log('Setup Health department');
      loginHealthDepartment();
      downloadHealthDepartmentPrivateKey();
      // We need to wait for the key rotation logic
      cy.wait(1000);
      logout();

      // SETUP Location
      cy.log('Setup Location');
      basicLocationLogin(E2E_COMPLETE_EMAIL, E2E_COMPLETE_PASSWORD);
      cy.visit(APP_ROUTE);
      downloadLocationPrivateKeyFile();
      cy.wait(1000);
      createGroup({
        ...createGroupPayload,
        name: FORM_WORKFLOW_TESTING_GROUP_NAME,
      });

      // Checkin with contact form
      cy.log('Checkin with in testing Location with Contact Form');
      cy.getByCy('startScanner').click();
      cy.get('.ant-modal').should('exist');
      cy.window().then(win => {
        cy.stub(win, 'open', link => {
          win.location.href = link;
        });
      });
      cy.getByCy('contactForm').click();
      const users = [];
      for (let index = 0; index < 5; index += 1) {
        users.push(fillForm());
      }
      logout();

      // Request data from testing Location
      cy.log('Request data from testing Location');
      loginHealthDepartment();
      uploadHealthDepartmentPrivateKeyFile();
      cy.getByCy('searchGroup').click();
      cy.get('.ant-modal').should('exist');
      cy.getByCy('groupNameInput').type(FORM_WORKFLOW_TESTING_GROUP_NAME);
      cy.getByCy('startGroupSearch').click();
      cy.getByCy(`group_${FORM_WORKFLOW_TESTING_GROUP_NAME}`).click();
      cy.get('input[id=date]').should('exist');
      cy.get('input[id=date]').click();
      cy.get('input[id=date]').type(yesterday);

      cy.get('.ant-picker-footer').find('.ant-picker-ok').should('exist');
      cy.get('.ant-picker-footer').find('.ant-picker-ok').click();
      cy.focused().type(tomorrow);

      cy.get('.ant-picker-ok button').should('exist');
      cy.get('.ant-picker-ok button').click();
      cy.getByCy('requestGroupData').click();
      cy.getByCy('processEntry').should('exist');
      cy.getByCy('processEntry').first().click();
      cy.getByCy(`contactLocation_${FORM_WORKFLOW_TESTING_GROUP_NAME}`)
        .first()
        .click();

      cy.get('.ant-popover-buttons button').should('exist');
      cy.get('.ant-popover-buttons button')
        .eq(1)
        .then($el => {
          cy.wrap($el).contains('Request data').click();
        });
      logout();

      // Share testing data from testing Location
      cy.log('Share testing data from testing Location');
      basicLocationLogin(E2E_COMPLETE_EMAIL, E2E_COMPLETE_PASSWORD);
      cy.visit(APP_ROUTE);
      cy.getByCy('dataRequests').click();
      cy.window().then(win => {
        cy.stub(win, 'open', link => {
          win.location.href = link;
        });
      });
      cy.getByCy('completeDataTransfer').first().click();
      uploadLocationPrivateKeyFile();
      cy.getByCy('next').click();
      cy.getByCy('finish').click();

      // Check requested data in Health department
      cy.log('Check requested data in Health department');
      logout();
      loginHealthDepartment();
      uploadHealthDepartmentPrivateKeyFile();
      cy.getByCy('processEntry').should('exist');
      cy.getByCy('processEntry').first().click();
      cy.getByCy(`confirmedLocation_${FORM_WORKFLOW_TESTING_GROUP_NAME}`)
        .first()
        .click();
      cy.get('.ant-modal').should('exist');

      for (let index = 0; index < users.length; index++) {
        const user = users[index];
        cy.getByCy('traceTable').contains(user.lastName);
        cy.getByCy('traceTable').contains(user.firstName);
        cy.getByCy('traceTable').contains(user.phoneNumber);
      }
    });
  });
});
