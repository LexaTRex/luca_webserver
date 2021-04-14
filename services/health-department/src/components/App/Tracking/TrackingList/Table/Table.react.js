import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import { getProcesses } from 'network/api';

import { COMPLETED, INCOMPLETED } from 'constants/filter';
import { TIME_DOWN } from 'constants/sorting';

import { sort } from './Table.helper';
// Components
import { TableWrapper, RowWrapper } from './Table.styled';
import { EmptyProcesses } from './EmptyProcesses';
import { Header } from './Header';
import { Entry } from './Entry';

export const Table = ({ filtering }) => {
  const [sorting] = useState(TIME_DOWN);
  const { isLoading, error, data: processes, refetch } = useQuery(
    'processes',
    () => getProcesses().then(response => response.json()),
    {
      cacheTime: 0,
    }
  );

  const filter = useCallback(
    processesToFilter => {
      switch (filtering) {
        case COMPLETED:
          return sort(processesToFilter, sorting).filter(
            process => process.isCompleted
          );
        case INCOMPLETED:
          return sort(processesToFilter, sorting).filter(
            process => !process.isCompleted
          );
        default:
          return sort(processesToFilter, sorting);
      }
    },
    [filtering, sorting]
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
