import React from 'react';
import { Badge } from 'antd';
import { useIntl } from 'react-intl';

import { TRACE_PROCESSES_STATUS_TYPES } from 'constants/traceProcesses';

export const CheckDone = ({ status }) => {
  const intl = useIntl();

  switch (status) {
    case TRACE_PROCESSES_STATUS_TYPES.NONE: {
      return (
        <Badge
          color="red"
          text={intl.formatMessage({ id: 'processTable.open' })}
        />
      );
    }
    case TRACE_PROCESSES_STATUS_TYPES.PARTIAL: {
      return (
        <Badge
          color="#ff9739"
          text={intl.formatMessage({ id: 'processTable.partlyDone' })}
        />
      );
    }
    case TRACE_PROCESSES_STATUS_TYPES.ALL: {
      return (
        <Badge
          color="#d3dec3"
          text={intl.formatMessage({ id: 'processTable.done' })}
        />
      );
    }
    case TRACE_PROCESSES_STATUS_TYPES.REQUESTED: {
      return (
        <Badge
          color="#dec3d5"
          text={intl.formatMessage({ id: 'processTable.requested' })}
        />
      );
    }
    case TRACE_PROCESSES_STATUS_TYPES.REQUEST_PARTIAL: {
      return (
        <Badge
          color="#c4c3de"
          text={intl.formatMessage({ id: 'processTable.partlyRequested' })}
        />
      );
    }
    default: {
      return null;
    }
  }
};
