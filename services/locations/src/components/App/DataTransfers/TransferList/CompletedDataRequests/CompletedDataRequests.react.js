import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';

import { getFormattedDate, getFormattedTime } from 'utils/time';
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
        <TableHeaderEntry style={{ flex: '14%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.date',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '14%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.timeFrom',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '14%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.timeUntil',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '28%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.location',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '16%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.healthDepartment',
          })}
        </TableHeaderEntry>
        <TableHeaderEntry style={{ flex: '14%' }}>
          {intl.formatMessage({
            id: 'dataTransfers.list.complete.table.header.approvedAt',
          })}
        </TableHeaderEntry>
      </TableHeader>
      {tracingProcesses.map(tracingProcess => (
        <TableRow key={tracingProcess.tracingProcessId}>
          <TableEntry style={{ flex: '14%' }}>
            {getFormattedDate(tracingProcess.createdAt)}
          </TableEntry>
          <TableEntry style={{ flex: '14%' }}>
            <div>{getFormattedDate(tracingProcess.timeSpan[0])}</div>
            <div>
              {`${moment.unix(tracingProcess.timeSpan[0]).format('HH:mm')}`}
            </div>
          </TableEntry>
          <TableEntry style={{ flex: '14%' }}>
            <div>{getFormattedDate(tracingProcess.timeSpan[1])}</div>
            <div>{getFormattedTime(tracingProcess.timeSpan[1])}</div>
          </TableEntry>
          <TableEntry style={{ flex: '28%' }}>
            {tracingProcess.transfers.map(transfer => (
              <div key={transfer.uuid}>
                {`${transfer.groupName} - ${
                  transfer.locationName ||
                  intl.formatMessage({ id: 'location.defaultName' })
                }`}
              </div>
            ))}
          </TableEntry>
          <TableEntry style={{ flex: '16%' }}>
            {tracingProcess.healthDepartment}
          </TableEntry>
          <TableEntry style={{ flex: '14%' }}>
            <div>
              {getFormattedDate(tracingProcess.transfers[0].approvedAt)}
            </div>
            <div>
              {getFormattedTime(tracingProcess.transfers[0].approvedAt)}
            </div>
          </TableEntry>
        </TableRow>
      ))}
    </Wrapper>
  );
};
