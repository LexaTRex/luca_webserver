import React, { useState } from 'react';

import { INCOMPLETED } from 'constants/filter';

// Components
import { TrackingListWrapper } from './TrackingList.styled';
import { Filter } from './Filter';
import { Table } from './Table';

export const TrackingList = () => {
  const [filtering, setFiltering] = useState(INCOMPLETED);

  return (
    <TrackingListWrapper>
      <Filter changeFilter={setFiltering} />
      <Table filtering={filtering} />
    </TrackingListWrapper>
  );
};
