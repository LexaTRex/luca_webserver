import React from 'react';

import { Header } from './Header';
import { HistoryTable } from './HistoryTable';

import { Wrapper } from './History.styled';

export const History = ({ process, refetch }) => {
  return (
    <Wrapper>
      <Header process={process} />
      <HistoryTable process={process} refetch={refetch} />
    </Wrapper>
  );
};
