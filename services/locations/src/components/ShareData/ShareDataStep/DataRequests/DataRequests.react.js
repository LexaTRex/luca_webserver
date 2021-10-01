import React from 'react';

import moment from 'moment';
import { useIntl } from 'react-intl';

import { RequestContent } from '../../ShareData.styled';
import {
  StyledLabel,
  StyledValue,
  StyledTransfer,
} from '../ShareDataStep.styled';

import { RequestWarning } from './RequestWarning';

const REQUEST_TIME_WARINING = 72;

export const DataRequests = ({ transfers }) => {
  const intl = useIntl();

  const timestampFormat = 'DD.MM.YYYY HH:mm';

  const formatTimeStamp = timestamp =>
    `${moment.unix(timestamp).format(timestampFormat)} ${intl.formatMessage({
      id: 'dataTransfers.transfer.timeLabel',
    })}`;

  const isRequestTimeSuspicious = (startTime, endTime) => {
    const duration = moment.duration(
      moment.unix(endTime).diff(moment.unix(startTime))
    );
    const requestTime = duration.asHours();
    return requestTime > REQUEST_TIME_WARINING;
  };

  return (
    <RequestContent>
      <StyledLabel>
        {intl.formatMessage({ id: 'shareData.dataRequest' })}
      </StyledLabel>
      {transfers.map(transfer => (
        <StyledTransfer key={transfer.transferId}>
          <StyledValue>
            {transfer.location.name}
            {isRequestTimeSuspicious(transfer.time[0], transfer.time[1]) && (
              <RequestWarning />
            )}
          </StyledValue>
          <StyledValue>{`${formatTimeStamp(transfer.time[0])} -`}</StyledValue>
          <StyledValue>{formatTimeStamp(transfer.time[1])}</StyledValue>
        </StyledTransfer>
      ))}
    </RequestContent>
  );
};
