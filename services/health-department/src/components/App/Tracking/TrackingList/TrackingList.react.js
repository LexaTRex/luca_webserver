import React, { useState } from 'react';
import { useQuery } from 'react-query';

import {
  ALL_PROCESS_TYPES,
  ALL_PROCESS_STATUS,
  INCOMPLETED_PROCESSES_STATE,
  ALL_PROCESS_ASSIGNEE,
} from 'constants/filters';

import { getProcesses } from 'network/api';

// Components
import { Table } from './Table';
import { ListFilters } from './ListFilters';
import { TrackingListWrapper } from './TrackingList.styled';

export const TrackingList = () => {
  const { isLoading, error, data: processes } = useQuery('processes', () =>
    getProcesses().then(response => response.json())
  );
  const [filters, setFilters] = useState({
    type: ALL_PROCESS_TYPES,
    status: [ALL_PROCESS_STATUS],
    state: INCOMPLETED_PROCESSES_STATE,
    assignee: [ALL_PROCESS_ASSIGNEE],
  });

  if (isLoading || error) return null;

  return (
    <TrackingListWrapper>
      <ListFilters
        filters={filters}
        onChange={setFilters}
        processes={processes}
      />
      <Table filters={filters} processes={processes} />
    </TrackingListWrapper>
  );
};
