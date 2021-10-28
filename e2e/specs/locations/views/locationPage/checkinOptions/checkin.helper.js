/* eslint-disable */
import { DELETE_E2E_DYNAMIC_TRACE_QUERY } from '../../../constants/databaseQueries';
import { loginLocations } from '../../../utils/auth';
import { createGroupPayload } from '../../../utils/payloads.helper';
import { deleteGroup } from '../../../utils/groups';

export const CHECKIN_GROUP_NAME = 'neXenio';

export const checkinSetup = () => {
  // remove trace if exists
  cy.executeQuery(DELETE_E2E_DYNAMIC_TRACE_QUERY);
  loginLocations();
  cy.createGroup({ ...createGroupPayload, name: CHECKIN_GROUP_NAME });
};

export const removeGroup = () => {
  cy.get('@groupId').then(groupId => {
    deleteGroup(groupId);
  });
  cy.logoutLocations();
};
