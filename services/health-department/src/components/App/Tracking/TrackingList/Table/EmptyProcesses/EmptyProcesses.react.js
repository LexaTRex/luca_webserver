import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

export const EmptyMessage = styled.div`
  width: 100%;
  padding: 24px;
  text-align: center;
`;

export const EmptyProcesses = () => {
  const intl = useIntl();
  return (
    <EmptyMessage data-cy="emptyProcesses">
      {intl.formatMessage({ id: 'processTable.empty' })}
    </EmptyMessage>
  );
};
