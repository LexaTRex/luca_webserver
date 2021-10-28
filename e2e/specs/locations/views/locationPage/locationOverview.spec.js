/* eslint-disable */
import moment from 'moment';

import {
  DELETE_E2E_DYNAMIC_TRACE_QUERY,
  DELETE_E2E_STATIC_TRACE_QUERY,
} from '../../constants/databaseQueries';
import { E2E_DEFAULT_LOCATION_FORM_ID } from '../../constants/locations';
import { APP_ROUTE, CONTACT_FORM_ROUTE } from '../../constants/routes';

import {
  dynamicTraceDataPayload,
  DYNAMIC_DEVICE_TYPES,
  formTraceDataPayload,
} from '../../utils/payloads.helper';

import { loginLocations } from '../../utils/auth';
import { loginHealthDepartment } from '../../../health-department/helper/api/auth.helper';
import { signHealthDepartment } from '../../../health-department/helper/signHealthDepartment';
import { checkoutGuests } from '../../ui-helpers/locationOverview';
import { dynamicCheckin, formCheckin } from '../../utils/traces';
import {
  verifyCheckinGuestTime,
  verifyCheckoutGuestTime,
  verifyGuestsCount,
} from '../../ui-helpers/validations';

const CURRENT_DATE = moment().format('DD.MM.YYYY');

const checkGuestInList = () => {
  // Expect the guest count to be 1
  verifyGuestsCount(1);
  // Expect the total checkin count to be 1 within the guest list modal
  cy.getByCy('showGuestList').click();
  cy.getByCy('totalCheckinCount').should('exist').and('contain', 1);
  verifyCheckinGuestTime(CURRENT_DATE);
  cy.get('.ant-modal-close-x').click();
  // Check out the guest
  checkoutGuests();
  // Expect the total checkin count to be 1 in the guest list modal
  cy.getByCy('showGuestList').click();
  verifyCheckoutGuestTime(CURRENT_DATE);
};

describe('Locations / Location overview', () => {
  before(() => {
    cy.executeQuery(DELETE_E2E_STATIC_TRACE_QUERY);
    cy.executeQuery(DELETE_E2E_DYNAMIC_TRACE_QUERY);
    loginHealthDepartment();
    signHealthDepartment();
  });

  beforeEach(() => {
    loginLocations();
  });

  describe('no checked-in guests is displayed by default', () => {
    it('when view new location', () => {
      verifyGuestsCount(0);
      cy.getByCy('showGuestList').click();
      cy.getByCy('totalCheckinCount').should('contain', 0);
    });
  });

  describe('guest count and the tracking time are changed', () => {
    it('when check-in/check-out location with contact form', () => {
      cy.visit(CONTACT_FORM_ROUTE);
      formCheckin({
        formId: E2E_DEFAULT_LOCATION_FORM_ID,
        traceDataPayload: formTraceDataPayload,
      });
      cy.basicLoginLocations();
      cy.visit(APP_ROUTE);
      checkGuestInList();
      cy.executeQuery(DELETE_E2E_STATIC_TRACE_QUERY);
    });

    it('when check-in/check-out location with camera scanner', () => {
      dynamicCheckin({
        ...dynamicTraceDataPayload,
        deviceType: DYNAMIC_DEVICE_TYPES.DEVICE_TYPE_WEBAPP,
      });
      checkGuestInList();
      cy.executeQuery(DELETE_E2E_DYNAMIC_TRACE_QUERY);
    });
  });
});
