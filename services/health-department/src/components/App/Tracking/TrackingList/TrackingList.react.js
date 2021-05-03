import React, { useState } from 'react';

import {
  ALL_PROCESS_TYPES,
  ALL_PROCESS_STATUS,
  INCOMPLETED_PROCESSES_STATE,
} from 'constants/filter';

// Components
import { Table } from './Table';
import { ListFilters } from './ListFilters';
import { TrackingListWrapper } from './TrackingList.styled';

export const TrackingList = () => {
  const [filters, setFilters] = useState({
    type: ALL_PROCESS_TYPES,
    status: [ALL_PROCESS_STATUS],
    state: INCOMPLETED_PROCESSES_STATE,
  });

  return (
    <TrackingListWrapper>
      <ListFilters filters={filters} onChange={setFilters} />
      <Table filters={filters} />
    </TrackingListWrapper>
  );
};
