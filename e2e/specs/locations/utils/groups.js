import { LOCATION_GROUPS_ROUTE } from '../constants/routes';
import {
  E2E_DEFAULT_GROUP_NAME,
  E2E_DEFAULT_LOCATION_GROUP,
  E2E_DEFAULT_LOCATION_GROUP_2,
} from '../constants/locations';
import { E2E_EMAIL, E2E_PASSWORD } from '../constants/users';

export const resetGroupName = () => {
  cy.request(
    'PATCH',
    `${LOCATION_GROUPS_ROUTE}/${E2E_DEFAULT_LOCATION_GROUP}`,
    {
      name: E2E_DEFAULT_GROUP_NAME,
    }
  );
};

export const resetGroups = () => {
  cy.request('GET', `${LOCATION_GROUPS_ROUTE}/`).then(async response => {
    const deletableGroups = response.body.filter(
      group =>
        group.groupId !== E2E_DEFAULT_LOCATION_GROUP &&
        group.groupId !== E2E_DEFAULT_LOCATION_GROUP_2
    );
    deletableGroups.forEach(group => deleteGroup(group.groupId));
  });
};

export const deleteGroup = groupId => {
  cy.request({
    method: 'DELETE',
    url: `api/v3/locationGroups/${groupId}`,
    auth: {
      username: E2E_EMAIL,
      password: E2E_PASSWORD,
    },
  });
};
