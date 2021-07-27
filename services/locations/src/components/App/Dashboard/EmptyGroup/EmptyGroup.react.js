import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router';

import { getGroups } from 'network/api';

import { BASE_LOCATION_ROUTE, BASE_GROUP_ROUTE } from 'constants/routes';

import { LocationFooter } from 'components/App/LocationFooter';

import { CreateGroup } from './CreateGroup';
import { Wrapper, Placeholder } from './EmptyGroup.styled';

export const EmptyGroup = () => {
  const intl = useIntl();
  const history = useHistory();
  const { groupId } = useParams();

  const { isLoading, error, data: groups } = useQuery('groups', () =>
    getGroups()
  );

  useEffect(() => {
    if (groups && groups.length > 0) {
      if (groupId) {
        const baseLocationId = groups
          .find(group => group.groupId === groupId)
          ?.locations.find(location => !location.name)?.uuid;

        if (baseLocationId) {
          history.push(
            `${BASE_GROUP_ROUTE}${groupId}${BASE_LOCATION_ROUTE}${baseLocationId}`
          );
          return;
        }
      }

      history.push(
        `${BASE_GROUP_ROUTE}${groups[0].groupId}${BASE_LOCATION_ROUTE}${
          groups[0].locations.find(location => !location.name).uuid
        }`
      );
    }
  }, [groups, groupId, history]);

  if (error || isLoading || (groups && groups.length > 0)) return null;

  return (
    <Wrapper>
      {intl.formatMessage({ id: 'group.noGroup' })}
      <CreateGroup />
      <Placeholder />
      <LocationFooter />
    </Wrapper>
  );
};
