import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';

import { Wrapper, Header } from '../TransferList.styled';
import {
  TableHeader,
  TableHeaderEntry,
  TableRow,
  TableEntry,
} from './CompletedDataRequests.styled';

export const CompletedDataRequests = ({ tracingProcesses }) => {
  tracingProcesses.sort((a, b) => b.createdAt - a.createdAt);

  const intl = useIntl();

  const formatDate = timestamp =>
    `${moment.unix(timestamp).format('DD.MM.YYYY')}`;

  return (
    <Wrapper>
      <Header>
        <div>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.header',
          })}
        </div>
        <div>{tracingProcesses.length}</div>
      </Header>
      <TableHeader>
        <TableHeaderEntry style={{ flex: '15%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.date',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '15%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.timeFrom',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '15%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.timeUntil',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '30%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.location',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '25%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.healthDepartment',
          })}
        </TableHeaderEntry>
      </TableHeader>
      {tracingProcesses.map(tracingProcess => (
        <TableRow key={tracingProcess.tracingProcessId}>
          <TableEntry style={{ flex: '15%' }}>
            {formatDate(tracingProcess.createdAt)}
          </TableEntry>
          <TableEntry style={{ flex: '15%' }}>
            <div>{formatDate(tracingProcess.timeSpan[0])}</div>
            <div>
              {`${moment.unix(tracingProcess.timeSpan[0]).format('HH:mm')}`}
            </div>
          </TableEntry>
          <TableEntry style={{ flex: '15%' }}>
            <div>{formatDate(tracingProcess.timeSpan[1])}</div>
            <div>
              {`${moment.unix(tracingProcess.timeSpan[1]).format('HH:mm')}`}
            </div>
          </TableEntry>
          <TableEntry style={{ flex: '30%' }}>
            {tracingProcess.transfers.map(transfer => (
              <div key={transfer.uuid}>
                {`${transfer.groupName} - ${
                  transfer.locationName ||
                  intl.formatMessage({ id: 'location.defaultName' })
                }`}
              </div>
            ))}
          </TableEntry>
          <TableEntry style={{ flex: '25%' }}>
            {tracingProcess.healthDepartment}
          </TableEntry>
        </TableRow>
      ))}
    </Wrapper>
  );
};
