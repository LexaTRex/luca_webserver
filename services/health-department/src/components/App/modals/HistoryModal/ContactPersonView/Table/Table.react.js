import React from 'react';
import { useIntl } from 'react-intl';

import { EmptyContactPerson } from './EmptyContactPerson';
import { Trace } from './Trace';
import { NonRegistredBadgeTrace } from './NonRegistredBadgeTrace';

import { TableWrapper, TableHeader, Column } from '../ContactPersonView.styled';

const TableRaw = ({ traces }) => {
  const intl = useIntl();

  return (
    <TableWrapper>
      <TableHeader>
        <Column flex="20%">
          {intl.formatMessage({ id: 'contactPersonTable.name' })}
        </Column>
        <Column flex="20%">
          {intl.formatMessage({ id: 'contactPersonTable.phone' })}
        </Column>
        <Column flex="15%">
          {intl.formatMessage({ id: 'contactPersonTable.checkinDate' })}
        </Column>
        <Column flex="15%">
          {intl.formatMessage({ id: 'contactPersonTable.checkinTime' })}
        </Column>
        <Column flex="15%">
          {intl.formatMessage({ id: 'contactPersonTable.checkoutDate' })}
        </Column>
        <Column flex="15%">
          {intl.formatMessage({ id: 'contactPersonTable.checkoutTime' })}
        </Column>
      </TableHeader>
      {traces.length > 0 ? (
        traces.map(trace =>
          trace.userData ? (
            <Trace key={trace.traceId} trace={trace} />
          ) : (
            <NonRegistredBadgeTrace />
          )
        )
      ) : (
        <EmptyContactPerson />
      )}
    </TableWrapper>
  );
};

export const Table = React.memo(TableRaw);
