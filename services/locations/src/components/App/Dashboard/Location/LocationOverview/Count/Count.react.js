import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import Icon from '@ant-design/icons';

import { ReactComponent as RefreshSvg } from 'assets/Refresh.svg';

import { COUNTER_REFETCH_INTERVAL_MS } from 'constants/timings';

import { getCurrentCount } from 'network/api';

import { Counter, Wrapper, Refresh } from './Count.styled';

const RefreshIcon = () => (
  <Icon component={RefreshSvg} style={{ fontSize: 16 }} />
);

export const Count = ({ location }) => {
  const intl = useIntl();

  const {
    data: currentCount,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
    refetch,
  } = useQuery(
    `current/${location.scannerId}`,
    () => getCurrentCount(location.scannerAccessId),
    {
      refetchInterval: COUNTER_REFETCH_INTERVAL_MS,
    }
  );

  const getCount = () => {
    if (isCurrentLoading) {
      return 0;
    }
    if (isCurrentError) {
      return intl.formatMessage({ id: 'location.count.error' });
    }
    return currentCount;
  };

  return (
    <Wrapper>
      <Counter data-cy="guestCount">{getCount()}</Counter>
      <Refresh
        title={intl.formatMessage({ id: 'location.count.refresh' })}
        onClick={refetch}
      >
        <RefreshIcon />
      </Refresh>
    </Wrapper>
  );
};
