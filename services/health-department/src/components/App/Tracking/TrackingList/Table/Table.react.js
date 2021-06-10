import React, { useState } from 'react';

import { TIME_DESC } from 'constants/sorting';

import { useFilterSorter } from '../ListFilters/hooks/useFilterSorter';

// Components
import { Entry } from './Entry';
import { Header } from './Header';
import { EmptyProcesses } from './EmptyProcesses';
import { TableWrapper, RowWrapper } from './Table.styled';

export const Table = ({ filters, processes, refetch }) => {
  const [sorting, setSorting] = useState(TIME_DESC);
  const [processNames, setProcessNames] = useState([]);
  const filter = useFilterSorter(filters, sorting);

  const onProcessName = (processId, processName) => {
    if (!processId || !processName) return;
    if (processNames.some(process => process.processId === processId)) return;
    processNames.push({ processId, processName });
    setProcessNames(processNames);
  };

  return (
    <TableWrapper>
      <Header setSorting={setSorting} sorting={sorting} />

      {filter(processes, processNames).length > 0 ? (
        <RowWrapper id="processes">
          {filter(processes, processNames).map(process => (
            <Entry
              key={process.uuid}
              process={process}
              refetch={refetch}
              onProcessName={onProcessName}
            />
          ))}
        </RowWrapper>
      ) : (
        <EmptyProcesses />
      )}
    </TableWrapper>
  );
};
