import React from 'react';
import { useIntl } from 'react-intl';

import { useLocationWithTransfers } from 'components/hooks/useLocationWithTransfers';

import {
  Wrapper,
  Heading,
  StatisticWrapper,
  Statistics,
} from './Header.styled';

export const Header = ({ process }) => {
  const intl = useIntl();
  const locations = useLocationWithTransfers(process.uuid);

  if (!locations) return null;

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
