import React from 'react';
import { useIntl } from 'react-intl';

// Components
import { Entry, TableRow } from '../TableAllocationModal.styled';

export const TableHeader = ({ activeTables }) => {
  const intl = useIntl();

  return (
    <>
      {!!Object.keys(activeTables).length && (
        <thead>
          <TableRow borderBottom headline="true">
            <Entry tableHeader>
              {intl.formatMessage({
                id: 'table',
              })}
            </Entry>
            <Entry tableHeader>
              {intl.formatMessage({
                id: 'modal.tableAllocation.checkedInGuests',
              })}
            </Entry>
            <Entry tableHeader>
              {intl.formatMessage({
                id: 'group.view.overview.tableAllocationCheckout',
              })}
            </Entry>
          </TableRow>
        </thead>
      )}
    </>
  );
};
