import React from 'react';
import { useIntl } from 'react-intl';

import {
  getIncompletedTransfers,
  getCompletedTransfers,
} from 'utils/shareData';

import { IncompletedDataRequests } from './IncompletedDataRequests';
import { CompletedDataRequests } from './CompletedDataRequests';

import { NoRequests } from './TransferList.styled';

export const TransferList = ({ transfers }) => {
  const intl = useIntl();

  const incompletedTransfersByTracingProcessId = getIncompletedTransfers(
    transfers
  );

  const completedTransfersByTracingProcessId = getCompletedTransfers(transfers);

  return (
    <>
      {transfers?.length === 0 ? (
        <NoRequests>
          {intl.formatMessage({ id: 'dataTransfers.noRequests' })}
        </NoRequests>
      ) : (
        <>
          {incompletedTransfersByTracingProcessId.length > 0 && (
            <IncompletedDataRequests
              tracingProcesses={incompletedTransfersByTracingProcessId}
            />
          )}

          {completedTransfersByTracingProcessId.length > 0 && (
            <CompletedDataRequests
              tracingProcesses={completedTransfersByTracingProcessId}
            />
          )}
        </>
      )}
    </>
  );
};
