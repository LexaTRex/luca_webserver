import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Button, Spin } from 'antd';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

// Api
import { getTraces } from 'network/api';

// Components
import {
  ActiveTableCount,
  buttonStyles,
  ContentValues,
  Entry,
  HeaderRow,
  HeaderValues,
  Loading,
  RefreshTime,
  TableContent,
  TableHeader,
  Wrapper,
} from './TableAllocationModal.styled';
import { extractTableNumbers } from './TableAllocationModal.helper';

export const TableAllocationModal = ({ privateKey, location }) => {
  const intl = useIntl();
  const [lastRefresh, setLastRefresh] = useState(moment());

  const {
    isLoading,
    error: fetchError,
    data: traces,
    refetch,
  } = useQuery(`traces/${location.uuid}`, () =>
    getTraces(location.accessId).then(response => response.json())
  );

  const activeTables = useMemo(() => extractTableNumbers(traces, privateKey), [
    traces,
    privateKey,
  ]);

  const refresh = () => {
    setLastRefresh(moment());
    refetch();
  };

  if (isLoading)
    return (
      <Loading>
        <Spin size="large" />
      </Loading>
    );
  if (fetchError) return null;

  return (
    <Wrapper>
      <HeaderRow>
        <ActiveTableCount>{`${intl.formatMessage({
          id: 'modal.tableAllocation.activeTableCount',
        })}: ${Object.keys(activeTables).length}`}</ActiveTableCount>
        <Button style={buttonStyles} onClick={refresh}>
          {intl.formatMessage({
            id: 'refresh',
          })}
        </Button>
      </HeaderRow>
      <TableHeader>
        <HeaderValues>
          <Entry>
            {intl.formatMessage({
              id: 'table',
            })}
          </Entry>
          <Entry>
            {intl.formatMessage({
              id: 'modal.tableAllocation.checkedInGuests',
            })}
          </Entry>
        </HeaderValues>
        <RefreshTime>
          {`${intl.formatMessage({
            id: 'modal.tableAllocation.lastRefresh',
          })}: ${moment(lastRefresh).format('DD.MM.YYYY - HH:mm:ss')}`}
        </RefreshTime>
      </TableHeader>
      <TableContent>
        {Object.keys(activeTables).map(table => (
          <ContentValues key={`table_${table}`}>
            <Entry>Tisch {table}</Entry>
            <Entry>{activeTables[table]}</Entry>
          </ContentValues>
        ))}
      </TableContent>
    </Wrapper>
  );
};
