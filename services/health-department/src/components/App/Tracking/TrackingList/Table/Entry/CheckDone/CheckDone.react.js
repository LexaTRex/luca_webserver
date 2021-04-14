import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { Badge } from 'antd';

import { getLocationTransfers } from 'network/api';

const TYPES = {
  NONE: 0,
  PARTIAL: 1,
  ALL: 2,
};

export const CheckDone = ({ processId }) => {
  const intl = useIntl();
  const {
    isLoading,
    error,
    data: locations,
  } = useQuery(`locationTransfer${processId}`, () =>
    getLocationTransfers(processId)
  );

  const completedLocations = useMemo(() => {
    if (isLoading) return null;

    const numberOfCompletedLocations = locations.filter(
      location => location.isCompleted
    ).length;

    if (numberOfCompletedLocations === 0) return TYPES.NONE;

    return numberOfCompletedLocations === locations.length
      ? TYPES.ALL
      : TYPES.PARTIAL;
  }, [locations, isLoading]);

  if (isLoading || error) return null;

  switch (completedLocations) {
    case TYPES.NONE: {
      return (
        <Badge
          color="red"
          text={intl.formatMessage({ id: 'processTable.open' })}
        />
      );
    }
    case TYPES.PARTIAL: {
      return (
        <Badge
          color="#ff9739"
          text={intl.formatMessage({ id: 'processTable.partlyDone' })}
        />
      );
    }
    case TYPES.ALL: {
      return (
        <Badge
          color="#d3dec3"
          text={intl.formatMessage({ id: 'processTable.done' })}
        />
      );
    }
    default: {
      return null;
    }
  }
};
