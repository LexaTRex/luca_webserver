import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

export const EmptyMessage = styled.div`
  width: 100%;
  padding: 24px;
  text-align: center;
`;

export const EmptySearch = () => {
  const intl = useIntl();
  return (
    <EmptyMessage>
      {intl.formatMessage({ id: 'groupSearch.table.empty' })}
    </EmptyMessage>
  );
};
