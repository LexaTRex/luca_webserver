import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

import { useQuery } from 'react-query';

import { getGroup } from 'network/api';

import {
  BASE_LOCATION_ROUTE,
  BASE_GROUP_ROUTE,
  LOCATION_ROUTE,
} from 'constants/routes';

import { CreateLocation } from './CreateLocation';
import { sortLocations } from './LocationList.helper';
import { Wrapper, Location, ListWrapper } from './LocationList.styled';

export const LocationList = () => {
  const intl = useIntl();
  const history = useHistory();
  const locationsRoute = useRouteMatch(LOCATION_ROUTE);

  const {
    isLoading,
    error,
    data: currentGroup,
  } = useQuery(`group/${locationsRoute?.params?.groupId}`, () =>
    locationsRoute?.params?.groupId
      ? getGroup(locationsRoute?.params?.groupId)
      : {}
  );

  const openLocation = locationId => {
    history.push(
      `${BASE_GROUP_ROUTE}${locationsRoute?.params?.groupId}${BASE_LOCATION_ROUTE}${locationId}`
    );
  };

  if (
    !locationsRoute?.params?.locationId ||
    !locationsRoute?.params?.groupId ||
    isLoading ||
    error
  )
    return null;

  return (
    <Wrapper id="groupList">
      <ListWrapper>
        {sortLocations(currentGroup.locations).map(location => {
          return (
            <Location
              key={location.uuid}
              data-cy={`location-${
                location.name ||
                intl.formatMessage({ id: 'location.defaultName' })
              }`}
              onClick={() => openLocation(location.uuid)}
              isActiveLocation={
                location.uuid === locationsRoute?.params?.locationId
              }
            >
              {location.name ||
                intl.formatMessage({ id: 'location.defaultName' })}
            </Location>
          );
        })}
      </ListWrapper>
      <CreateLocation groupId={currentGroup.groupId} />
    </Wrapper>
  );
};
