import React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';

import { getLocation } from 'network/api';

import {
  BASE_LOCATION_SETTINGS_ROUTE,
  BASE_GROUP_ROUTE,
} from 'constants/routes';

import { Checkout } from './Checkout';
import { CheckInQuery } from './CheckInQuery';
import { StartScanner } from './StartScanner';
import { GenerateQRCodes } from './GenerateQRCodes';
import { TableSubdivision } from './TableSubdivision';
import { LocationOverview } from './LocationOverview';
import {
  Wrapper,
  HeaderWrapper,
  Header,
  Settings,
  NameWrapper,
} from './Location.styled';

export const Location = () => {
  const intl = useIntl();
  const history = useHistory();

  const { locationId } = useParams();

  const { isLoading, error, data: location } = useQuery(
    `location/${locationId}`,
    () => getLocation(locationId),
    {
      cacheTime: 0,
    }
  );

  if (isLoading || error) return null;

  const openSettings = () => {
    history.push(
      `${BASE_GROUP_ROUTE}${location.groupId}${BASE_LOCATION_SETTINGS_ROUTE}${location.uuid}`
    );
  };

  return (
    <Wrapper>
      <HeaderWrapper>
        <NameWrapper>
          <Header data-cy="locationDisplayName">
            {location.name ||
              intl.formatMessage({ id: 'location.defaultName' })}
          </Header>
          <Settings data-cy="openSettings" onClick={openSettings}>
            {intl.formatMessage({ id: 'location.settings' })}
          </Settings>
        </NameWrapper>
      </HeaderWrapper>
      <StartScanner location={location} />
      <LocationOverview location={location} />
      <CheckInQuery location={location} />
      <TableSubdivision location={location} />
      <GenerateQRCodes location={location} />
      {location.lat && location.lng && <Checkout location={location} />}
    </Wrapper>
  );
};
