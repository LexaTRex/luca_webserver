import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { getCurrentCount } from 'network/api';

import { Counter } from './Count.styled';

export const Count = ({ location }) => {
  const intl = useIntl();

  const {
    data: currentCount,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
  } = useQuery(
    `current/${location.scannerId}`,
    () =>
      getCurrentCount(location.scannerAccessId).then(response =>
        response.json()
      ),
    {
      refetchInterval: 5000,
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

  return <Counter data-cy="guestCount">{getCount()}</Counter>;
};
