import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { getLocationTransfers } from 'network/api';

import {
  Wrapper,
  Heading,
  StatisticWrapper,
  Statistics,
} from './Header.styled';

export const Header = ({ process }) => {
  const intl = useIntl();

  const { isLoading, error, data: locations } = useQuery(
    'locationTransfer',
    () => getLocationTransfers(process.uuid),
    { refetchOnWindowFocus: false }
  );

  if (isLoading || error) return null;

  const completedLocations = locations.filter(location => location.isCompleted);

  return (
    <Wrapper>
      <Heading>
        {intl.formatMessage({
          id: 'history',
        })}
      </Heading>
      <StatisticWrapper>
        <Statistics>{`${locations.length} ${intl.formatMessage({
          id: 'history.locations',
        })}`}</Statistics>
        <Statistics>{`${completedLocations.length} / ${
          locations.length
        } ${intl.formatMessage({
          id: 'history.confirmed',
        })}`}</Statistics>
      </StatisticWrapper>
    </Wrapper>
  );
};
