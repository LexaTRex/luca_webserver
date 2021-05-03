import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { getProcesses } from 'network/api';

import { TIME_DOWN } from 'constants/sorting';

import { useFilters } from './useFilters';

// Components
import { Entry } from './Entry';
import { Header } from './Header';
import { EmptyProcesses } from './EmptyProcesses';
import { TableWrapper, RowWrapper } from './Table.styled';

export const Table = ({ filters }) => {
  const [sorting] = useState(TIME_DOWN);
  const filter = useFilters(filters, sorting);
  const { isLoading, error, data: processes, refetch } = useQuery(
    'processes',
    () => getProcesses().then(response => response.json()),
    {
      cacheTime: 0,
    }
  );
  if (isLoading || error) return null;

  return (
    <TableWrapper>
      <Header />

      {filter(processes).length > 0 ? (
        <RowWrapper id="processes">
          {filter(processes).map(process => (
            <Entry key={process.uuid} process={process} refetch={refetch} />
          ))}
        </RowWrapper>
      ) : (
        <EmptyProcesses />
      )}
    </TableWrapper>
  );
};
